'use strict';

const cli = require('heroku-cli-util');
const co = require('co');

function* app (context, heroku) {

   let members = yield heroku.get(encodeURI('/teams/'+context.flags.team+'/members'));
   let deletedMembers = [];
   for(var i in members) {
      if(context.flags.all || (members[i].email.indexOf('heroku.com') == -1 && members[i].email.indexOf('salesforce.com') == -1)) {
         deletedMembers.push(members[i]);
      }
   }
   // confirm with user that this action should be taken.
   yield cli.confirmApp('remove', context.flags.confirm, 'This is a destructive action and will remove all users('+deletedMembers.length+') that DO NOT have a heroku.com or salesforce.com email address');   

   cli.debug('Removing members... ');
   let output = yield deletedMembers.map(deleteMember);
   cli.table(output, {
      columns: [
         {key: 'email', label: 'Removed User'}
      ]
   })

   function deleteMember(member) {  
      cli.hush('Deleting member '+member.email);
      return heroku.request({
         method: 'DELETE',
         path: '/teams/'+context.flags.team+'/members/'+member.id,
      });
   }
}

module.exports = {
   topic: 'demokit',
   command: 'users:remove',
   description: 'Will remove all users (except salesforce.com and heroku.com users) from the given Team.',
   flags: [
      {name:'team', char:'t', description:'[REQUIRED] team to remove users from', hasValue:true, required:true},
      {name:'all', char:'a', description:'include salesforce.com and heroku.com users in removal', hasValue:false, required:false},
      {name:'remove', description:'remove users without validation', hasValue:true}
   ],
   needsAuth: true,
   run: cli.command(co.wrap(app))
}