'use strict';

const cli = require('heroku-cli-util');
const co = require('co');

function* app (context, heroku) {
   cli.error("demokit:users:info has yet to be implemented");
}

module.exports = {
   topic: 'demokit',
   command: 'users:info',
   description: 'List the apps and resources owned by a particular user',
   help: '\
Usage: heroku demokit:users:info -u --user <TEAM NAME>',
   flags: [
      {name:'user', char:'e', description:'email address of user', hasValue:true}
   ],
   needsAuth: true,
   run: cli.command(co.wrap(app))
}