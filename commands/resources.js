'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
   cli.error("demokit:apps:delete has yet to be implemented.... ");
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
      {name:'team', char:'t', description:'team used to perform the aggregations on.', hasValue:true}
   ],
   run: cli.command(co.wrap(app))
}