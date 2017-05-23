'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   cli.debug('Gathering all apps and dyno formations for this team and setting to zero.. this could take a minute..');
   // get all apps for this team
   let apps = yield heroku.get('/teams/'+context.flags.team+'/apps');
   let allFormations = [];
   for(let i in apps) {
      let app = apps[i];
      allFormations.push(heroku.get('/apps/'+app.id+'/formation'));
   }
   Promise.all(allFormations).then(formations => {
      // scale all dynos to zero
      console.log(JSON.stringify(formations));
      /*
      for(let j in formations) {
         let formation = formations[j][0];

         if(formation.id) {
         //cli.debug(formation);
         //cli.debug('/apps/'+formation.app.name+'/formation/'+formation.id);
            cli.action('Scaling all dynos for '+app.name+' to zero', heroku.request({
               method: 'PATCH',
               path: '/apps/'+formation.app.name+'/formation/'+formation.id,
               body: {
                  quantity:0,
                  size: formation.size
               }
            })).then(values => {
               cli.debug(values);
            }, reason => {
               cli.error(reason);
            });
         }
      }*/
   }, reason => {
      cli.error(reason);
   });
}

module.exports = {
   topic: 'demokit',
   command: 'apps:scaleToZero',
   description: 'Will loop through all apps in the given Team and scale all dynos to zero.',
   help: '\
Usage: heroku demokit:apps:scaleToZero -t --team <TEAM NAME>',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used when looking for apps to turn off', hasValue:true, required:true}
   ],
   run: cli.command(co.wrap(app))
}