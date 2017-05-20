'use strict';

const cli = require('heroku-cli-util');
const co = require('co');

function* app (context, heroku) {

   let app = yield cli.action('getting members', co(function*(){
      let members = yield heroku.get(encodeURI('/teams/'+context.flags.team+'/members'));
      var deletedMembers = [];
      for(var i in members) {
         if(members[i].email.indexOf('heroku.com') == -1 && members[i].email.indexOf('salesforce.com') == -1) {
            deletedMembers.push(members[i]);
         }
      }
      yield cli.confirmApp('remove', context.flags.confirm, 'This is a destructive action and will remove all users('+deletedMembers.length+') that DO NOT have a heroku.com or salesforce.com email address');
      for(var i in deletedMembers) {
         let deleted = yield cli.action('delete user '+members[i].email+' to team '+context.flags.team +' as a '+members[i].role, heroku.request({
            method: 'DELETE',
            path: '/teams/'+context.flags.team+'/members/'+members[i].id,
         }));
         cli.hush(deleted);
      }
   }));
}

module.exports = {
   topic: 'demokit',
   command: 'users:remove',
   description: 'Will remove all users (except running user) from the given Team.',
   help: '\
Usage: heroku demokit:users:remove -t --team <TEAM NAME>\n\n\
If team is ommitted, will revert to your Personal Apps',
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true, required:true},
      {name:'remove', description:'remove users without validation', hasValue:true}
   ],
   needsAuth: true,
   run: cli.command(co.wrap(app))
}