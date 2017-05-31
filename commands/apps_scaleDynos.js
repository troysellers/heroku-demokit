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
      for(var app of allApps) {
         if(!app.team) {
            apps.push(app);
         }
      }
   }
   cli.debug('Gathering dyno formations for all apps....');
   let allFormations = yield apps.map(getDynoFormation);
   cli.debug('Scaling dyno formations for all apps....');
   cli.debug('Complete... scaled all apps');
   let output = yield allFormations.map(scaleFormation);
   cli.table(output, {
      columns: [
         {key: 'app.name', label: 'App Name'},
         {key: 'type', label: 'Dyno Type'},
         {key: 'quantity', label: 'Quantity'},
         {key: 'size', label: 'Size'}
      ]
   })

   function getDynoFormation(app) {
      cli.hush('Getting dyno formation for '+app.name);
      return heroku.get('/apps/'+app.id+'/formation')
   }

   function scaleFormation(formation) {

      return heroku.request({
            method: 'PATCH',
            path: 'https://api.heroku.com/apps/'+formation[0].app.name+'/formation/'+formation[0].id,
            body: {
               quantity: numberOfDynos,
               size: formation[0].size
            }
         });
   }

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