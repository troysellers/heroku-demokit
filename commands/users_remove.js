'use strict';

const cli = require('heroku-cli-util');
const co = require('co');

function* app (context, heroku) {
   if(!context.flags.team) {
      cli.error('You need to specify a Team name');
   } else {
      cli.debug("This will remove all team members that DO NOT have an heroku.com or salesforce.com email address");
      let app = yield cli.action('getting members', co(function*(){
         let members = yield heroku.get(encodeURI('/teams/'+context.flags.team+'/members'));
         for(var i in members) {
            if(members[i].email.indexOf('heroku.com') == -1 && members[i].email.indexOf('salesforce.com') == -1) {
               let deleted = yield cli.action('delete user '+members[i].email+' to team '+context.flags.team +' as a '+members[i].role, heroku.request({
                  method: 'DELETE',
                  path: '/teams/'+context.flags.team+'/members/'+members[i].id,
               }));
               cli.hush(deleted);
            }
         }
      }));
   }
}

module.exports = {
   topic: 'demokit',
   command: 'users:remove',
   description: 'Will remove all users (except running user) from the given Team.',
   help: '\
Usage: heroku demokit:users:remove -t --team <TEAM NAME>\n\n\
If team is ommitted, will revert to your Personal Apps',
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true}
   ],
   needsAuth: true,
   run: cli.command(co.wrap(app))
}