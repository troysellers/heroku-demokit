'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   // let the user know to get a cup of coffee.. 
   // TODO figure out how to parallel call API so we can remove this 
   cli.debug('Gathering apps and dyno counts... this might take a minute..');
   
   // get the list of apps that we are going to aggregate
   let apps = yield heroku.get('/teams/'+context.flags.team+'/apps');
   var appCount = apps.length;
   var appsByLanguage = {};
   var appLanguages = new Set();

   // for each App, retrieve the list of dynos so we can aggregate
   // How to parellel execute? ? ? 
   for (var i in apps) {
      var app = apps[i];
      cli.debug('Getting dynos for app '+app.name);
      app.dynoList = yield heroku.get('/apps/'+app.name+'/dynos');
      
      // identify apps created that haven't had code pushed
      if(app.buildpack_provided_description == null) {
         app.buildpack_provided_description = 'Empty';
      }
      
      // create the array that we use to aggregate by language
      if(!appsByLanguage.hasOwnProperty(app.buildpack_provided_description)) {
         appsByLanguage[app.buildpack_provided_description] = [];
      }

      // push app into byLanguages aggregation. Track language in Set for uniqueness
      appsByLanguage[app.buildpack_provided_description].push(app);
      appLanguages.add(app.buildpack_provided_description);
   }
   // create array of table row objects for table display by language
   var byLanguageArray = [];
   for (let language of appLanguages) {
      var appsLanguage = appsByLanguage[language];
      var tableRow = {};
      tableRow.language = language;
      tableRow.installCount = appsLanguage.length;
      tableRow.dynoCount = 0;
      for(var i in appsLanguage) {
         tableRow.dynoCount += appsLanguage[i].dynoList.length;
      }
      byLanguageArray.push(tableRow);
   }

   cli.styledHeader("Summary");
   cli.styledHash({"Total Languages": appLanguages.size, "Total Apps": apps.size});
   console.log('\n');

   cli.styledHeader("Apps by Language");
   // display table that shows app installs by Language
   cli.table(byLanguageArray, {
      columns: [
         {key: 'language', label: 'Language'},
         {key: 'installCount', label: 'App Count'},
         {key: 'dynoCount',label:'Total Dynos'},
      ]
   });   
   console.log('\n');
   cli.styledHeader("Apps");
   // display table that shows app installs by Language
   cli.table(apps, {
      columns: [
         {key: 'name', label: 'App Name'},
         {key: 'buildpack_provided_description', label: 'Language'},
         {key: 'dynoList.length',label:'Dynos'}
      ]
   });    
}
module.exports = {
   topic: 'demokit',
   command: 'apps',
   description: 'Count and list all the apps that exist for a given Team. Aggregates by language.',
   help: '\
   Usage: heroku demokit:apps -t --team <TEAM NAME>',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true, required:true} 
   ],   
   run: cli.command(co.wrap(app))
}