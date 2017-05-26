'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   let numberOfDynos = context.flags.quantity ? context.flags.quantity : 0;

   // get all apps for this team
   cli.debug('Scaling all dynos for team '+context.flags.team+ ' to '+numberOfDynos);
   let apps = yield heroku.get('/teams/'+context.flags.team+'/apps');
   let allFormations = [];
   for(let i in apps) {
      let app = apps[i];
      allFormations.push(heroku.get('/apps/'+app.id+'/formation'));
   }
   cli.debug('Gathering formations for '+apps.length+' apps');
   Promise.all(allFormations).then(formations => {

      let appFormations = {};
      for(let j in formations) {
         let formation = formations[j][0];
         // remove any empty
         if(formation && formation.app) {
            if(!appFormations[formation.app.name]) {
               appFormations[formation.app.name] = [];
            } 
            let formationUpdate = {};
            formationUpdate.quantity = numberOfDynos;
            formationUpdate.size = formation.size;
            formationUpdate.type = formation.type;
            appFormations[formation.app.name].push(formationUpdate);
         }
      }

      let formationCalls = [];
      for(let name in appFormations) {
         if(appFormations.hasOwnProperty(name)) {
            formationCalls.push(heroku.request({
               method: 'PATCH',
               path: 'https://api.heroku.com/apps/'+name+'/formation',
               body: {
                  updates : appFormations[name]
               }
            }));
         }
      } 
      cli.debug('Scaling all formations to '+numberOfDynos+'...');
      Promise.all(formationCalls).then(values => {
         cli.debug('Completed scaling all apps to '+numberOfDynos+' dynos..');
      }, error => {
         cli.error(error);
      });
   }, reason => {
      cli.error(reason);
   });
}

module.exports = {
   topic: 'demokit',
   command: 'apps:scaleDynos',
   description: 'Will loop through all apps in the given Team and scale all dynos to given number.',
   help: '\If the -q --quantity flag is provided this will scale all dynos to this number. It will preserve the same dyno size. If the quantity flag has not been provided it will default to zero (0) and can be used to shut down all apps in the team.',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used when looking for apps to turn off', hasValue:true, required:true},
      {name:'quantity', char:'q', description:'number of dynos to scale all apps to', hasValue:true, required:false}
   ],
   run: cli.command(co.wrap(app))
}