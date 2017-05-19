'use strict'

const co = require('co')
const cli= require('heroku-cli-util')

module.exports = {
   topic: 'demokit',
   command: 'apps',
   description: 'Count and list all the apps that exist for a given Team.',
   help: '\
   Usage: heroku demokit:apps -t --team <TEAM NAME>\
   If team is ommitted, will revert to your Personal Apps',
   needsApp: false,
   needsAuth: true,
   run: function(context) {
      console.log('TODO : Implement demokit:apps -t <TEAM>')
   }
}