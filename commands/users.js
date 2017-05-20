'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   // let the user know to get a cup of coffee.. 
   // TODO figure out how to parallel call API so we can remove this 
   cli.debug('Gathering apps and dyno counts... this might take a minute..');
   
   let users = yield heroku.get('/teams/'+context.flags.team+'/members');
   cli.debug('We have '+users.length+' users in '+context.flags.team+' team');
   var owners = new Set();
   var appsByUser = {};

   // initialise by UserId with empty array for apps
   for(var i in users) {
      owners.add(users[i].id);
      appsByUser[users[i].id] = [];
   }

   // get the list of apps that we are going to aggregate
   let apps = yield heroku.get('/teams/'+context.flags.team+'/apps');
   cli.debug('Found '+apps.length+' apps in this team '+context.flags.team);
   var appCount = apps.length;

   // for each App, retrieve the list of dynos so we can aggregate
   // How to parellel execute? ? ? 
   for (var a in apps) {
      cli.debug(JSON.stringify(app[a]));
      app.dynoList = yield heroku.get('/apps/'+app[a].name+'/dynos');
      cli.debug('Found '+app.dynoList.length+' dynos for app '+app[a].name);
      // push app into byOwners aggregation.
      appsByOwner[app.owner.id].push(app);
   }

      // create array of table row objects for table display by owner
   var byOwnerArray = []; 
   for(let ownerId of owners) {
      apps = appsByOwners[ownerId];
      var tableRow = {};
      tableRow.ownerEmail = apps[0].owner.email;
      tableRow.installCount = apps.length;
      tableRow.dynoCount = 0;
      for(var i in apps) {
         tableRow.dynoCount += apps[i].dynoList.length;
      }
   }

   cli.styledHeader("Totals");
   cli.styledHash({name: "userinfo", "total users":owners.size, "Total Apps":apps.size});

      // display table that shows app installs by Owner
   cli.styledHeader("Apps and Dynos by Owner");
   cli.table(byOwnerArray, {
      columns: [
         {key: 'ownerEmail', label: 'Owner'},
         {key: 'installCount', label: 'Installs'},
         {key: 'dynoCount',label:'Total Dynos'},
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