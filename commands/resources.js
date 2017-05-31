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
      let allApps = yield heroku.get('/apps').catch(err => cli.error(err));
      // filter out to just apps that have no team
      for(var app of allApps) {
         if(!app.team) {
            apps.push(app);
         } 
      }
   }
   cli.debug('Gathering dynos for '+apps.length+' apps');
   let data = yield apps.map(getAddons);

   let tableData = [];
   let aggregateData = {};
   let addOnService = new Set();
   let addOnPlan = new Set();
   let addOnApp = new Set();
   for(var addons of data) {
      for(var addon of addons) {
         //something to count with...
         addOnService.add(addon.name);
         addOnPlan.add(addon.plan);
         addOnApp.add(addon.app.name);

         // gather data for verbose mode
         let row = {};
         row.app = addon.app;
         row.addon_service = addon.addon_service;
         row.plan = addon.plan;
         tableData.push(row);

         // gather data for aggregate
         if(!aggregateData[addon.name]) {
            aggregateData[addon.name] = {};
            aggregateData[addon.name].name = addon.name;
            aggregateData[addon.name].apps = [];
            aggregateData[addon.name].type = addon.addon_service.name;
         }
         aggregateData[addon.name].apps.push(addon.app.name);
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

   function getAddons(app) {
      cli.hush('gathering addons for '+app.name);
      return heroku.get('/apps/'+app.name+'/addons');
   }
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