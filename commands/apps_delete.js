'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
   var count = '<COUNT>';
   yield cli.confirmApp('delete', context.flags.confirm, 'This is a destructive action and will destroy '+count+' apps');
   cli.error("demokit:apps:delete has yet to be implemented.... ");
}

module.exports = {
   topic: 'demokit',
   command: 'apps:delete',
   description: 'Will delete all apps in the given Team.',
   help: '\
   Usage: heroku demokit:apps:delete -t --team <TEAM NAME>',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true},
      {name:'confirm', description:'confirm the destructive action of delete', hasValue:true}
   ],
   run: cli.command(co.wrap(app))
}