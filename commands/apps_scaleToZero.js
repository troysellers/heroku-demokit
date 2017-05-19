module.exports = {
   topic: 'demokit',
   command: 'apps:scaleToZero',
   description: 'Will loop through all apps in the given Team and scale all dynos to zero.',
   help: '\
Usage: heroku demokit:apps:scaleToZero -t --team <TEAM NAME>\n\n\
If team is ommitted, will revert to your Personal Apps',
   needsApp: false,
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used when looking for apps to turn off', hasValue:true}
   ],
   run: function(context) {
      console.log('TODO : Implement demokit:users:remove -t <TEAM>')
   }
}