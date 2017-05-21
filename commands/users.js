'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   // let the user know to get a cup of coffee.. 
   // TODO figure out how to parallel call API so we can remove this 
   cli.debug('Gathering apps and dyno counts... this might take a minute..');

   let users = yield heroku.get('/teams/'+context.flags.team+'/members');
   cli.debug('We have '+users.length+' users in '+context.flags.team+' team');
   
   // get the list of apps that we are going to aggregate
   let apps = yield heroku.get('/teams/'+context.flags.team+'/apps');
   cli.debug('Gathering dyno counts for '+apps.length+' apps in '+context.flags.team+' team');
   
   // get the dynos operating for each app

   var funcArr = [];
   for(var i=0 ; i<apps.length ; i++) {
      var app = apps[i];
      cli.debug('Get dynos for app '+app.name);
      app.dynoList = yield heroku.get('/apps/'+app.name+'/dynos'); 
   }

   cli.styledHeader("Users ("+users.length+")");
   cli.table(users, {
      columns: [
         {key: 'email', label: 'User Email'},
         {key: 'role', label: 'Role'}
      ]
   }); 
   console.log('\n');
      // display table that shows app installs by Owner
   cli.styledHeader("Apps and Dynos");
   cli.table(apps, {
      columns: [
         {key: 'name', label: 'App Name'},
         {key: 'dynoList.length',label:'Total Dynos'}
      ]
   }); 
}



module.exports = {
   topic: 'demokit',
   command: 'users',
   description: 'Count and list all the Users that have access for a given Team. Aggregates by User.',
   help: '\
   Usage: heroku demokit:users -t --team <TEAM NAME>',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true, required:true}
   ],
   run: cli.command(co.wrap(app))
}