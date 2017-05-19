'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
   cli.error("demokit:apps has yet to be implemented.... ");
}

module.exports = {
   topic: 'demokit',
   command: 'apps',
   description: 'Count and list all the apps that exist for a given Team.',
   help: '\
   Usage: heroku demokit:apps -t --team <TEAM NAME>',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true}
   ],   
   run: cli.command(co.wrap(app))
}