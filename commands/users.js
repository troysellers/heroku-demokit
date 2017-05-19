module.exports = {
   topic: 'demokit',
   command: 'users',
   description: 'Count and list all the users that have access to the given Team.',
   help: '\
   Usage: heroku demokit:users -t --team <TEAM NAME>\
   If team is ommitted, will revert to your Personal Apps',
   needsApp: false,
   needsAuth: true,
   run: function(context) {
      console.log('TODO : Implement demokit:users -t <TEAM>')
   }
}