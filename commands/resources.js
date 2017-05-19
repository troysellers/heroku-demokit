module.exports = {
   topic: 'demokit',
   command: 'resources',
   description: 'Provides an output of currently used resources for this Team.',
   help: '\
Usage: heroku demokit:resources -t --team <TEAM NAME>\n\n\
If team is ommitted, will revert to your Personal Apps',
   needsApp: false,
   needsAuth: true,
   flags: [
      {name:'team', char:'t', description:'team used to perform the aggregations on.', hasValue:true}
   ],
   run: function(context) {
      console.log('TODO : Implement demokit:resources -t <TEAM>')
   }
}