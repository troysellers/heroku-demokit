'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   cli.debug('Gathering apps.... ');
   let apps = [];
   if(context.flags.team) {
      // get all apps for this team
      apps = yield heroku.get('/teams/'+context.flags.team+'/apps').catch(err => cli.error(err));
   } else {
      let allApps = yield heroku.get('/apps').catch(err => cli.error(err));;
      // filter out to just apps that have no team
      for(var app of allApps) {
         if(!app.team) {
            apps.push(app);
         }
      }
   }
   let appCount = apps.length;
   // gather the different language types that are used in apps
   let appLanguages = new Set();

   for (var i in apps) {
      var app = apps[i];
      app.dynoList = []; // create an empty array for dynoList property
      // identify apps created that haven't had code pushed
      if(app.buildpack_provided_description == null) {
         app.buildpack_provided_description = 'Empty';
      }      
      // we want a set of of all different lanugages that are being used.
      appLanguages.add(app.buildpack_provided_description);
   }
   
   cli.debug('Gather dynos for '+apps.length+' apps');
   let data = yield apps.map(getDynos);

   let dynoCount = 0;
   let emptyAppCount = 0;
   for(var d of data) {
      let dynoResult = d[0];
      if(dynoResult) {
         dynoCount++;
         for(let i in apps) {
            let app = apps[i];
            if(app.name == dynoResult.app.name) {
               app.dynoList.push(dynoResult);
            }
         }
      } else {
         emptyAppCount++;
      }
   }
   let appsByLanguage = {};
   // gather all apps as lists by language
   for(let i in apps) {
      let app = apps[i];
      if(!appsByLanguage.hasOwnProperty(app.buildpack_provided_description)) {
         appsByLanguage[app.buildpack_provided_description] = [];
      }
      appsByLanguage[app.buildpack_provided_description].push(app);
   }

   if(!context.flags.verbose) {
      let byLanguageArray = []; // data for table display
      for (let language of appLanguages) {
         let appsLanguage = appsByLanguage[language]; // get list of apps for this language
         let tableRow = {};
         tableRow.language = language;
         tableRow.dynoCount = 0;
         if(appsLanguage) {
            tableRow.installCount = appsLanguage.length;
            for(let i in appsLanguage) {
               if(appsLanguage[i].dynoList != null) {
                  tableRow.dynoCount += appsLanguage[i].dynoList.length;
               }
            }
         }
         byLanguageArray.push(tableRow);
      }

      cli.styledHeader("Total Apps : "+apps.length);
      cli.styledHeader("Total Dynos : "+dynoCount);
      cli.styledHeader("Apps with no dynos : "+emptyAppCount);

      cli.styledHeader("Apps by Language");
      // display table that shows app installs by Language
      cli.table(byLanguageArray, {
         columns: [
            {key: 'language', label: 'Language'},
            {key: 'installCount', label: 'App Count'},
            {key: 'dynoCount',label:'Total Dynos'},
         ]
      });   
   } else {
      cli.table(apps, {
         columns: [
            {key: 'name', label: 'App Name'},
            {key: 'buildpack_provided_description', label:'Buildpack'},
            {key: 'dynoList.length', label: "No. Dynos"}
         ]
      })
   }

   function getDynos(app) {
      cli.hush('gathering dynos for '+app.name);
      return heroku.get('/apps/'+app.name+'/dynos');
   }

}
module.exports = {
   topic: 'demokit',
   command: 'apps',
   description: 'Count and list all the apps that exist and display dynos and buildpacks.',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true, required:false},
      {name:'verbose', char:'v', description:'provide a verbose, by app output', hasValue: false, required:false} 
   ],   
   run: cli.command(co.wrap(app))
}