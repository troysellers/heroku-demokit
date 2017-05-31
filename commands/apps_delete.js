'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   let apps = [];
   var appsToDelete = 'Delete all apps from ';
   if(context.flags.team) {
      appsToDelete += 'team '+context.flags.team;
      apps = yield heroku.get('/teams/'+context.flags.team+'/apps').catch(err => cli.error(err));
   }  else {
      appsToDelete += 'Personal Apps';
      let allApps = yield heroku.get('/apps').catch(err => cli.error(err));
      // filter out to just apps that have no team
      for(var app of allApps) {
         if(!app.team) {
            apps.push(app);
         } 
      }
   }
   cli.styledHeader(appsToDelete);
   cli.table(apps, {
      columns: [
         {key:'name', label:'App to Delete'}
      ]}
   )
   if(apps && apps.length > 0) {
      yield cli.confirmApp('delete', context.flags.confirm, 'This is a destructive action and will destroy '+apps.length+' apps');

      let deleted = yield apps.map(deleteApp);
      deleted.map(printDeleted);
   } else {
      cli.debug('Nothing to delete...');
   }

   function deleteApp(app) {
      cli.hush('Deleting app '+app.id);
      return heroku.request({
         method: 'DELETE',
         path: '/apps/'+app.id,
      });
   }
   function printDeleted(app) {
      cli.debug('Deleted '+app.name);
   }
}

module.exports = {
   topic: 'demokit',
   command: 'apps:delete',
   description: 'Will delete all apps in the given Team, if no team supplied, will delete Personal Apps',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true, required:false},
      {name:'confirm', description:'confirm the destructive action of delete', hasValue:true}
   ],
   run: cli.command(co.wrap(app))
}