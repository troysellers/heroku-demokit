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

```
Usage: heroku demokit:apps

Count and list all the apps that exist and display dynos and buildpacks.

 -t, --team TEAM     # team to invite users to
 -v, --verbose       # provide a verbose, by app output
```
Summarise apps by language and count dynos running by language, or provide a verbose output.

e.g. - summary 
```
heroku demokit:apps -t my_team

'Gathering apps.... '
'Gathering dynos....'
=== Total Apps : 11
=== Total Dynos : 10
=== Apps with no dynos : 1
=== Apps by Language
Language  App Count  Total Dynos
────────  ─────────  ───────────
Ruby      1          1
Java      4          4
Node.js   2          2
Empty     1
PHP       1          1
Go        1          1
Python    1          1
```

e.g. - verbose for Personal Apps
```
heroku demokit:apps -v 

'Gathering apps.... '
'Gathering dynos....'
App Name                Buildpack  No. Dynos
──────────────────────  ─────────  ─────────
immense-reaches-72111   Ruby       1
heroku-101-kt           Java       1
dry-garden-97998        Java       1
radiant-fortress-33147  Node.js    1
empty-kt                Empty
peaceful-inlet-89959    PHP        1
salty-cove-42830        Go         1
heroku-301-client-kt    Node.js    1
heroku-201-kt           Java       1
fast-waters-13478       Java       1
powerful-shore-41460    Python     1
```

### demokit:apps:delete
TODO - implement

```
> heroku demokit:apps:delete            # Will delete all apps in the given Team.
```

### demokit:apps:scaleDynos

```
heroku demokit:apps:scaleToZero       # Will loop through all apps in the given Team and scale all dynos to zero.
```
Use this command when you want to scale all the dyno formations to all the apps in a team to the same number. Most useful for scaling all apps to zero at the end of training so cost is not incurred for running dynos. 
When scaling it will preserve the size of each dyno formation (i.e. Standard-1X will stay a Standard-1X)

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
