# Heroku Demokit (Under Construction)

This is an extension to the Heroku CLI that will allow a user to manage users and resources in their Heroku Team during [training](https://github.com/ibigfoot/heroku-101).

## Install
Installing the plug requires you to link to the directory you download this code to. At the moment, there is no plans to host on npmjs.com
See this [devcenter article](https://devcenter.heroku.com/articles/developing-cli-plugins#installing-the-plugin) for the details.. but basically

```
> git clone https://github.com/ibigfoot/heroku-demokit.git
> cd heroku-demokit
> heroku plugins:link .
> heroku demokit --help
```
You should see the various options for the demokit in your Heroku CLI now. 

## Commands

### demokit:apps 
TODO - implement

Display a table of sumamrised app usage for a particular team. 
Shows apps total, apps with code, language totals and apps that are empty.

```
> heroku demokit:apps                   # Count and list all the apps that exist for a given Team.
```
This command will list all the apps with a nice summary of apps created. It is quite useful as you go through the training to see if users are actually following along and creating new apps :) 

### demokit:apps:delete
TODO - implement

Deletes all apps for a Team. The idea of this is to be used at the end of the day when all apps need to be destroyed to save resources. 
Include a -f --filter flag that allows a user to filter out apps (i.e. keep all apps where name contains '401')

```
> heroku demokit:apps:delete            # Will delete all apps in the given Team.
```

### demokit:apps:scaleToZero
TODO - implement
Scale all dynos in all apps that are listed for a team to zero. You may not want to delete apps, but want to stop incuring cost.
```
heroku demokit:apps:scaleToZero       # Will loop through all apps in the given Team and scale all dynos to zero.
```

### demokit:resources
TODO - implement

Display a table of all resources, by dyno, data and partner addons. The goal is to be able to get a summary of the total resource breakdown.
```
heroku demokit:resources              # Provides an output of currently used resources for this Team.
```

### demokit:users

```
heroku demokit:users                  # Count and list all the users that have access to the given Team.
```

This command will collect a count of all users as well as the list of apps, dyno count and language used and display. It can take a little while to run as (at the moment) it is a synchronous call to each app to get the list of dynos and collate. 

Typically use this command to track how many users have accepted the invitation to the team and have started to create apps.

### demokit:users:invite

```
> heroku demokit:users:invite -t <TEAM> -f <path to users.csv>          # Will invite a list of users to the specified team.
```

Command will read the csv file and invite users to the specified team. 

File should have two columns
```
email, role
example@email.com, admin
example2@email.com, member
example3@email.com, collaborator
```


### demokit:users:remove

```
> heroku demokit:users:remove -t <TEAM>          # Will remove all users (except running user) from the given Team.
```

Command will look for all users that are part of the team used for training. Any user that doesn't have an heroku.com or salesforce.com email address will be removed from the Team. 
