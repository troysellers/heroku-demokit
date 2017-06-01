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
   cli.debug('Gathering addons for '+apps.length+' apps');
   
   let data = yield apps.map(getAddons);
   let verboseData = [];

   for (var i=0 ; i < apps.length ; i++) {
      apps[i].addons = data[i];
      apps[i].addonNames = [];
      for(var addon of data[i]){
         apps[i].addonNames.push(addon.plan.name);
         let row = {appName:apps[i].name, addonName: addon.name, plan : addon.plan.name, billingApp : addon.app.name};
         verboseData.push(row);
      }
   }

   let appCount = 0;
   let addonServices = new Set();
   let addonPlans = new Set();
   for(let i of data) {
      if (i.length > 0) {
         appCount++;
         for(let j of i) {
            addonServices.add(j.addon_service.name);
            addonPlans.add(j.plan.name);
         }
      }
   }

   if(context.flags.verbose) {
      cli.table(verboseData, {
         columns: [
            {key: 'appName', label: 'App'},
            {key: 'addonName', label: 'Addon Name'},
            {key: 'plan', label: 'Addon Plan'},
            {key: 'billingApp', label: 'Billing App'}
         ]
      })
   } else {
      cli.styledHeader('Total Apps : '+apps.length);
      cli.styledHeader('Apps with addons : '+appCount);
      cli.styledHeader('Distinct services : '+addonServices.size);
      cli.styledHeader('Distinct plans : '+addonPlans.size);     
      cli.styledHash({'Distinct plans': Array.from(addonPlans)}); 
      cli.log('Run with -v flag to see app and addon details');
   }
/*
   console.log(addonService);
   console.log(addonPlan);

   let tableData = {};
   let aggregateData = {};
   let addOnService = new Set();
   let addOnPlan = new Set();
   let addOnApp = new Set();
   for(var addons of data) {
      for(var addon of addons) {
         //something to count with...
         addOnService.add(addon.name);
         addOnPlan.add(addon.plan.name);
         addOnApp.add(addon);

         // gather data for verbose mode
         let row = {};
         row.app = addon.app;
         row.addon_service = addon.addon_service;
         row.plan = addon.plan;
         if(!tableData[addon.app.name]) {
            tableData[addon.app.name] = {};
         }
         tableData[addon.app.name] = row;

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

      let tableDataArray = [];
      for(var i of Object.keys(tableData)) {
         console.log(tableData[i]);
         tableDataArray.push(tableData[i]);
      }
      cli.table(tableDataArray, {
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

*/
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