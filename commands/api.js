'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {
   let result = yield heroku.get(context.args.path).catch(err => cli.error(err));
   cli.debug(result);
}

module.exports = {
   topic: 'demokit',
   command: 'api:get',
   description: 'Tests an API get command.',
   needsAuth: true,
   help: 'Requires user to supply the path of the get request to the Heroku API. \ne.g. heroku demokit:api:get /apps',
   args: [
      {name:'path', description:'the get request to send to the api', optional:false}
   ],
   run: cli.command(co.wrap(app))
}