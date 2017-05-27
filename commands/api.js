'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   cli.debug(context.apiToken);
   
   let result = yield heroku.get(context.flags.path).catch(err => cli.error(err));
   cli.debug(result);
}

module.exports = {
   topic: 'demokit',
   command: 'api:get',
   description: 'Tests an API get command.',
   needsAuth: true,
   flags: [
      {name:'path', char:'p', description:'the get request to send to the api', hasValue:true, required:true}
   ],
   run: cli.command(co.wrap(app))
}