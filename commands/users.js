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

      // output information about Team Members (users)
      cli.styledHeader("Team Members : "+members.length);
      cli.styledHeader("Total Apps : "+apps.length);
      cli.table(members, {
         columns: [
            {key: 'email', label: 'User Email'},
            {key: 'role', label: 'Role'}
         ]
      }); 
   }, error => {
         cli.error(error);
   });
}
module.exports = {
   topic: 'demokit',
   command: 'users',
   description: 'Show users from a specific team',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'[REQUIRED] team you want to display users associated with', hasValue:true, required:true}
   ],
   run: cli.command(co.wrap(app))
}