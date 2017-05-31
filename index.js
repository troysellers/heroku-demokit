'use strict'

exports.topic = {
   name: 'demokit',
   description: 'helps to manage the team org for demo days'
}

exports.commands = [
   require('./commands/users.js'),
   require('./commands/users_invite.js'),
   require('./commands/users_remove.js'),
   require('./commands/apps.js'),    
   require('./commands/apps_delete.js'),  
   require('./commands/apps_scaleDynos.js'),   
   require('./commands/apps_deploy.js'), 
   require('./commands/resources.js'),
   require('./commands/api.js')
]

