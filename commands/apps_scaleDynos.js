'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   let numberOfDynos = context.flags.quantity ? context.flags.quantity : 0;
   let apps = [];
   if(context.flags.team) {
      // get all apps for this team
      cli.debug('Scaling all dynos for team '+context.flags.team+ ' to '+numberOfDynos);
      apps = yield heroku.get('/teams/'+context.flags.team+'/apps');
   } else {
      cli.debug('Scaling dynos on Personal Apps to '+numberOfDynos); 
      let allApps = yield heroku.get('/apps');
      // filter out to just apps that have no team
      for(let i in allApps) {
         if(!allApps[i].team) {
            apps.push(allApps[i]);
         }
      }
   }

   
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
   description: 'Scales all dynos to either zero or the given quantity, will operate on Personal Apps if not supplied a team.',
   help: '\If the -q --quantity flag is provided this will scale all dynos to this number. It will preserve the same dyno size. If the quantity flag has not been provided it will default to zero (0) and can be used to shut down all apps.',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'operate on apps belonging to this team only', hasValue:true, required:false},
      {name:'quantity', char:'q', description:'number of dynos to scale apps to', hasValue:true, required:false}
   ],
   run: cli.command(co.wrap(app))
}