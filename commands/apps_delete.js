module.exports = {
   topic: 'demokit',
   command: 'apps:delete',
   description: 'Will delete all apps in the given Team.',
   help: '\
   Usage: heroku demokit:apps:delete -t --team <TEAM NAME>',
   needsApp: false,
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team to invite users to', hasValue:true}
   ],
   run: function(context) {
      console.log('TODO : Implement demokit:apps:delete -t <TEAM>')
   }
}