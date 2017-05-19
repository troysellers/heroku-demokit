'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
   cli.error("demokit:users has yet to be implemented.... ");
}

module.exports = {
   topic: 'demokit',
   command: 'users',
   description: 'Count and list all the users that have access to the given Team.',
   help: '\
   Usage: heroku demokit:users -t --team <TEAM NAME>',
   needsAuth: true,
   run: cli.command(co.wrap(app))
}