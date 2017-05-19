'use strict'

const cli = require('heroku-cli-util');
const co = require('co');

function * app(context, heroku)  {

   if (!context.flags.team) {
      cli.error("You need to specify the team using the -t flag.. aborting");
   } else {
      let apps = yield heroku.get('/teams/'+context.flags.team+'/apps');
      var appCount = apps.length;
      var appsByLanguage = {};
      var appLanguages = new Set();
      for (var i in apps) {
         var app = apps[i];
         if(app.buildpack_provided_description == null) {
            app.buildpack_provided_description = 'Empty';
         }

         if(!appsByLanguage.hasOwnProperty(app.buildpack_provided_description)) {
            appsByLanguage[app.buildpack_provided_description] = [];
         }
         
         appsByLanguage[app.buildpack_provided_description].push(app);
         appLanguages.add(app.buildpack_provided_description);
      }
      for (let s of appLanguages) {
         apps = appsByLanguage[s];
         console.log('We have '+apps.length+' '+s+' apps');
      }
   }
}

/*  THIS IS AN APP
{ archived_at: null,
    buildpack_provided_description: 'Java',
    build_stack: 
     { id: 'ee582d3c-717d-4a57-ba5f-8b3a39f3a817',
       name: 'heroku-16' },
    created_at: '2017-05-19T08:48:08Z',
    id: '42a3181b-a16b-415c-bf03-26078b4952f8',
    git_url: 'https://git.heroku.com/heroku-101-kt.git',
    maintenance: false,
    name: 'heroku-101-kt',
    owner: 
     { email: 'korea-training@herokumanager.com',
       id: 'daf2207b-9c61-4e3d-be96-5c2d53c37de4' },
    region: { id: '59accabd-516d-4f0e-83e6-6e3757701145', name: 'us' },
    organization: 
     { id: 'daf2207b-9c61-4e3d-be96-5c2d53c37de4',
       name: 'korea-training' },
    team: 
     { id: 'daf2207b-9c61-4e3d-be96-5c2d53c37de4',
       name: 'korea-training' },
    space: null,
    released_at: '2017-05-19T08:48:50Z',
    repo_size: null,
    slug_size: 148055704,
    stack: 
     { id: 'ee582d3c-717d-4a57-ba5f-8b3a39f3a817',
       name: 'heroku-16' },
    updated_at: '2017-05-19T08:48:50Z',
    web_url: 'https://heroku-101-kt.herokuapp.com/',
    joined: false,
    legacy_id: 'app68895476@heroku.com',
    locked: false }
*/

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