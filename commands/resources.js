'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
  
   cli.debug('Fetching users and the addons they have provisioned. This could take a minute... ');

   var totalAddons = 0;
   // TODO can we parallel execute? 
   let users = yield heroku.get('/teams/'+context.flags.team+'/members');
   for(let user in users) {
      let addons = yield heroku.get('/users/'+user.id+'/addons');
      totalAddons += addons.size;
      for (let addon in addons) {
         addonsByUser[user.id].push(addon);
      }
      cli.styledHeader(user.email);
      cli.table(addons, {
         columns: [
            {key: 'addon_service.name', label:'Addon Name'},
            {key: 'plan.name', label:'Addon Plan'},
            {key: 'app.name', label :'Billing App'}
         ]
      });
   }

   cli.styledHeader("Aggregates");
   cli.styledHash({name:"Aggregates", "Total Users":users.size, "Total Addons":totalAddons});
   
}

module.exports = {
   topic: 'demokit',
   command: 'resources',
   description: 'Provides an output of currently used resources for this Team.',
   help: '\
Usage: heroku demokit:resources -t --team <TEAM NAME>',
   needsApp: false,
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used to perform the aggregations on.', hasValue:true, required:true}
   ],
   run: cli.command(co.wrap(app))
}