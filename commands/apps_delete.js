'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   let apps = heroku.get('/teams/'+context.flag.team+'/apps');
   yield cli.confirmApp('delete', context.flags.confirm, 'This is a destructive action and will destroy '+apps.length+' apps');

   // can we do this in parallel?
   for(let app in apps) {
      let deleted = yield cli.action('Deleting app '+app.name, heroku.request({
            method: 'DELETE',
            path: '/apps/'+app.id,
         }));
   }
}

module.exports = {
   topic: 'demokit',
   command: 'apps:delete',
   description: 'Will delete all apps in the given Team.',
   help: '\
   Usage: heroku demokit:apps:delete -t --team <TEAM NAME>',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true, required:true},
      {name:'confirm', description:'confirm the destructive action of delete', hasValue:true}
   ],
   run: cli.command(co.wrap(app))
}