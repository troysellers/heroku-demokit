'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   cli.debug('Gathering all apps and dyno formations for this team and setting to zero.. this could take a minute..');
   // get all apps for this team
   let apps = heroku.get('/teams/'+context.flag.team+'/apps');

   // get each formation and scale to zero.. can we do this in parallel?
   for(let app in apps) {
      let formations = heroku.get('/apps/'+app.id+'/formation');
      updates = [];
      for(let formation in formations) {
         var update = {};
         update.quantity = 0;
         update.size = formation.size;
         update.type = formation.type;
         updates.push(update);
      }
      let scale = yield cli.action('Scaling all dynos for '+app.name+' to zero', heroku.request({
            method: 'PATCH',
            path: '/teams/'+context.flags.team+'/invitations',
            body: updates
         }
      ));
   }
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