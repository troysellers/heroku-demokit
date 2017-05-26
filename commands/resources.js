'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
  
   var totalAddons = 0;
   cli.debug('Gathering team members ...');
   let users = yield heroku.get('/teams/'+context.flags.team+'/members');
   
   let addOnCallArray = [];
   for(let user in users) {
      addOnCallArray.push(heroku.get('/users/'+user.id+'/addons'));
   }
   
   Promise.all(addOnCallArray).then(addons => {
      let totalAddons = 0;
      for(let i in addons) {
         let user = users[i]; // addons array will be returned in same order as user array
         user.addonList = addons[i][0];
         totalAddons += user.addonList.length;
      }
      cli.table(users, {
         columns: [
            {key: 'email', label:'User'},
            {key: 'addonList', label:'Addons'}
         ]
      });    
      cli.styledHeader("Aggregates");
      cli.styledHash({name:"Aggregates", "Total Users":users.size, "Total Addons":totalAddons});       
   }, callError => {
      cli.error(callError);
   });   
}

module.exports = {
   topic: 'demokit',
   command: 'resources',
   description: 'Provides an output of currently used resources for this Team.',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used to perform the aggregations on.', hasValue:true, required:true}
   ],
   run: cli.command(co.wrap(app))
}