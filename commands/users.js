'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   cli.debug('Gathering users and apps .... ');

   let callArray = [];
   callArray.push(heroku.get('/teams/'+context.flags.team+'/members'));
   callArray.push(heroku.get('/teams/'+context.flags.team+'/apps'));

   Promise.all(callArray).then(values => {
      let members = values[0];
      let apps = values[1];
      let dynoCalls = [];
      for(let i in apps) {
         let app = apps[i];
         app.dynoList = [];
         dynoCalls.push(heroku.get('/apps/'+app.name+'/dynos')); 
      }
      // output information about Team Members (users)
      cli.styledHeader("Team Members ("+members.length+")");
      cli.table(members, {
         columns: [
            {key: 'email', label: 'User Email'},
            {key: 'role', label: 'Role'}
         ]
      }); 
      // get all the dyno information
      Promise.all(dynoCalls).then(dynos => {
         for (let i in dynos) {
            let dyno = dynos[i][0];
            if(dyno) {
               for (let j in apps) {
                  let app = apps[j];
                  if(dyno.app.name == app.name) {
                     app.dynoList.push(dyno);
                  }
               }
            }
         }
         cli.styledHeader("Apps and Dynos");
         cli.table(apps, {
            columns: [
               {key: 'name', label: 'App Name'},
               {key: 'dynoList.length',label:'Total Dynos'}
            ]
         });          
      }, appCallError => {
         cli.error(appCallError);
      });
   }, error => {
         cli.error(error);
   });
}
module.exports = {
   topic: 'demokit',
   command: 'users',
   description: 'Show users and apps',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'[REQUIRED] team to invite users to', hasValue:true, required:true}
   ],
   run: cli.command(co.wrap(app))
}