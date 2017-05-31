'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

module.exports = {
   topic: 'demokit',
   command: 'apps:deploy',
   description: 'Deploys the 8 \'<language>-getting-started\' applications from the Heroku Github repository.',
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true, required:false},
      {name:'region', char:'r', description:'what region this should be placed in', hasValue:true, required:false}
   ],   
   run: cli.command(co.wrap(app))
}

function * app(context, heroku)  {

   let apps = ['https://github.com/heroku/node-js-getting-started/tarball/master',
            'https://github.com/heroku/python-getting-started/tarball/master',
            'https://github.com/heroku/java-getting-started/tarball/master',
            'https://github.com/heroku/php-getting-started/tarball/master',
            'https://github.com/heroku/ruby-getting-started/tarball/master',
            'https://github.com/heroku/clojure-getting-started/tarball/master',
            'https://github.com/heroku/go-getting-started/tarball/master',
            'https://github.com/heroku/scala-getting-started/tarball/master'];

   let output = yield apps.map(deployApp);
   cli.debug('We have queued '+output.length+' apps for deploy');

   function deployApp(app) {
      cli.debug('Deploying '+app);
      let config = {};
      if(context.flags.team) {
         config.organization = context.flags.team;
      }
      if(context.flags.region) {
         config.region = context.flags.region;
      }
      return heroku.request({
            method: 'POST',
            path: 'https://api.heroku.com/app-setups',
            body: {
               source_blob: {
                 url: app
               },
               app: config
            }
         });
   }
}

