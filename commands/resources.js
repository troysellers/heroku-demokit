'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
  
   var totalAddons = 0;
   let apps = [];
   if(context.flags.team) {
      cli.debug('Gathering apps for team '+context.flags.team);
      apps = yield heroku.get('/teams/'+context.flags.team+'/apps').catch(err => cli.error(err));
   }  else {
      cli.debug('Gathering apps for Personal Apps ');
      let allApps = yield heroku.get('/apps');
      // filter out to just apps that have no team
      for(let i in allApps) {
         if(!allApps[i].team) {
            apps.push(allApps[i]);
         } 
      }
   }

   let addOnCalls = [];
   for (let i in apps) {
      addOnCalls.push(heroku.get('/apps/'+apps[i].name+'/addons'));
   }

   Promise.all(addOnCalls).then(addons => {
      let tableData = [];
      let aggregateData = {};
      let addOnService = new Set();
      let addOnPlan = new Set();
      let addOnApp = new Set();
      for(let i in addons) {
         for(let j in addons[i]) {
            //something to count with...
            addOnService.add(addons[i][j].name);
            addOnPlan.add(addons[i][j].plan);
            addOnApp.add(addons[i][j].app.name);

            // gather data for verbose mode
            let row = {};
            row.app = addons[i][j].app;
            row.addon_service = addons[i][j].addon_service;
            row.plan = addons[i][j].plan;
            tableData.push(row);

            // gather data for aggregate
            if(!aggregateData[addons[i][j].name]) {
               aggregateData[addons[i][j].name] = {};
               aggregateData[addons[i][j].name].name = addons[i][j].name;
               aggregateData[addons[i][j].name].apps = [];
               aggregateData[addons[i][j].name].type = addons[i][j].addon_service.name;
            }
            aggregateData[addons[i][j].name].apps.push(addons[i][j].app.name);
         }
      }
      if(context.flags.verbose) {
         cli.table(tableData, {
            columns: [
               {key: 'app.name', label: 'App Name'},
               {key: 'addon_service.name', label: 'Add On'},
               {key: 'plan.name', label: 'Plan'}
            ]
         });
      } else {
         let data = [];
         for(let prop in aggregateData) {
            if(aggregateData.hasOwnProperty(prop)) {
               data.push(aggregateData[prop]);
            }
         }
         cli.table(data, {
            columns: [
               {key: 'type', label: 'Add On Service'},
               {key: 'name', label: 'Add On Name'},
               {key: 'apps.length', label: 'No. Attached Apps'}
            ]
         });
      }
      cli.styledHeader("Number of Different Services: " + addOnService.size);
      cli.styledHeader("Number of Distinct AddOns: " + addOnPlan.size);
      cli.styledHeader("Number of Apps with AddOns: " + addOnApp.size);
   }).catch(err => {
      cli.error(err);
   })
}

module.exports = {
   topic: 'demokit',
   command: 'resources',
   description: 'Provides an output of currently used resources for this Team.',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used to perform the aggregations on.', hasValue:true, required:false},
      {name:'verbose', char:'v', description:'display apps with addons and associtated plans.', hasValue:false, required:false}
   ],
   run: cli.command(co.wrap(app))
}