'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   cli.debug('Gathering users .... ');

   let callArray = [];
   let members =  yield heroku.get('/teams/'+context.flags.team+'/members');

   cli.table(members, {
      columns: [
         {key: 'email', label: 'User Email'},
         {key: 'role', label: 'Role'}
      ]
   }); 
   cli.styledHeader('Total Users : '+members.length);
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