'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
   cli.error("demokit:apps:scaleToZero has yet to be implemented.... ");
}

module.exports = {
   topic: 'demokit',
   command: 'apps:scaleToZero',
   description: 'Will loop through all apps in the given Team and scale all dynos to zero.',
   help: '\
Usage: heroku demokit:apps:scaleToZero -t --team <TEAM NAME>',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used when looking for apps to turn off', hasValue:true}
   ],
   run: cli.command(co.wrap(app))
}