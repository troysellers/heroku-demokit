'use strict';

const cli = require('heroku-cli-util');
const co = require('co');

function* app (context, heroku) {

   cli.debug('Fetching all apps and addons for user:'+context.flags.user+' that are associated with '+context.flags.team+'. This could take a minute...');

   let apps = yield heroku.get('/teams/'+context.flags.team+'/members/'+context.flags.email+'}/apps');
   cli.debug('Fetched '+apps.length+' apps...');
   var totalAddons = 0;
   for(let app in apps) {
      cli.debug('Searching addons for app '+app.name);
      let addons = yield heroku.get('/apps/'+app.id+'/addons');
      var addonArray = []
      totalAddons += addons.length;
      for (addon in addons) {
         addonArray.push(addon.addon_service.name +":"+addon.plan.name);
      }
      cli.styledHash({name:app.name, "Add Ons": addonArray});
   }  
   cli.debug('User has '+apps.length+' apps and '+totalAddons+' in '+context.flags.team+' team');
}

module.exports = {
   topic: 'demokit',
   command: 'users:info',
   description: 'List the apps and resources owned by a particular user',
   help: '\
Usage: heroku demokit:users:info -u --user <TEAM NAME>',
   flags: [
      {name:'user', char:'e', description:'email address of user', hasValue:true, required:true},
      {name:'team', char:'t', description:'team we want details on', hasValue:true, required:true}
   ],
   needsAuth: true,
   run: cli.command(co.wrap(app))
}