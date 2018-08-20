# Heroku Demokit 

This is an extension to the Heroku CLI that will allow a user to manage users and resources in their Heroku Team during [training](https://github.com/ibigfoot/heroku-101).

## Install
The version of CLI and Node that this is currently built for is 
```
heroku -v
heroku/7.9.3 darwin-x64 node-v10.9.0

```

If you are using different versions you may encounter unexpected results, they are not tested (well actually, nothing is really 'tested' so [caveat emptor](https://en.wikipedia.org/wiki/Caveat_emptor)! )

Installing the plugin 
```
> heroku plugins:install heroku-cli-demokit
Installing plugin heroku-cli-demokit... done
```

Or, you can download the repository and link if you wanted to change the code, add or break it to your hearts content. 
```
> git clone https://github.com/ibigfoot/heroku-demokit.git
> cd heroku-demokit
> heroku plugins:link .
> heroku demokit --help
```
You should see the various options for the demokit in your Heroku CLI now. 

```
> heroku demokit --help

heroku demokit commands: (heroku help demokit:COMMAND for details)

 demokit:users           # Show users from a specific team
 demokit:users:invite    # Read csv of user details and invite to the specified team.
 demokit:users:remove    # Will remove all users (except salesforce.com and heroku.com users) from the given Team.
 demokit:apps            # Count and list all the apps that exist and display dynos and buildpacks.
 demokit:apps:delete     # Will delete all apps in the given Team, if no team supplied, will delete Personal Apps
 demokit:apps:scaleDynos # Scales all dynos to either zero or the given quantity, will operate on Personal Apps if not supplied a team.
 demokit:apps:deploy     # Deploys the 8 '<language>-getting-started' applications from the Heroku Github repository.
 demokit:resources       # Provides an output of currently used resources for this Team.
 demokit:api:get PATH    # Tests an API get command.
```
## Commands

### demokit:api:get
```
Usage: heroku demokit:api:get PATH

Tests an API get command.

Requires user to supply the path of the get request to the Heroku API.
e.g. heroku demokit:api:get /apps
 ```
 Command is a convenience for wrapping a GET request to the Heroku API. 
 Outputs the result to the console.

 e.g. - get app info 
 ```
heroku demokit:api:get /apps/troys-pipeline-java

{ acm: false,
  archived_at: null,
  buildpack_provided_description: 'Java',
  build_stack: 
   { id: 'ee582d3c-717d-4a57-ba5f-8b3a39f3a817',
     name: 'heroku-16' },
  created_at: '2017-05-09T07:00:06Z',
  id: 'a6038db6-06cd-4879-98f1-27475f2883f0',
  git_url: 'https://git.heroku.com/troys-pipeline-java.git',
  maintenance: false,
  name: 'troys-pipeline-java',
  owner: 
   { email: 'tsellers@heroku.com',
     id: '840e324f-7be2-48e7-950d-712a0d9211b4' },
  region: { id: '59accabd-516d-4f0e-83e6-6e3757701145', name: 'us' },
  organization: null,
  team: null,
  space: null,
  released_at: '2017-05-10T00:02:21Z',
  repo_size: null,
  slug_size: 53804589,
  stack: 
   { id: 'ee582d3c-717d-4a57-ba5f-8b3a39f3a817',
     name: 'heroku-16' },
  updated_at: '2017-05-27T06:59:35Z',
  web_url: 'https://troys-pipeline-java.herokuapp.com/' }
 ```

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
> heroku demokit:apps
'Gathering apps.... '
'Gather dynos for 9 apps'
=== Total Apps : 9
=== Total Dynos : 8
=== Apps with no dynos : 1
=== Apps by Language
Language               App Count  Total Dynos
─────────────────────  ─────────  ───────────
PHP                    1          1
Empty                  1
Clojure (Leiningen 2)  1          1
Play 2.x - Scala       1          1
Java                   1          1
Ruby                   1          1
Python                 1          1
Go                     1          1
Node.js                1          1
```

e.g. - verbose for Personal Apps
```
> heroku demokit:apps -v
'Gathering apps.... '
'Gather dynos for 9 apps'
App Name               Buildpack              No. Dynos
─────────────────────  ─────────────────────  ─────────
agile-taiga-42739      PHP                    1
intense-depths-71594   Empty
morning-earth-15676    Clojure (Leiningen 2)  1
pure-springs-43756     Play 2.x - Scala       1
glacial-castle-10774   Java                   1
thawing-falls-49374    Ruby                   1
gentle-eyrie-49852     Python                 1
glacial-gorge-69548    Go                     1
secret-badlands-51129  Node.js                1
```

### demokit:apps:delete

```
Usage: heroku demokit:apps:delete

Will delete all apps in the given Team, if no team supplied, will delete Personal Apps

 -t, --team TEAM     # team to invite users to
 --confirm CONFIRM   # confirm the destructive action of delete
```

**Destructive action that will delete all apps**, either in your Personal Apps or in the specified team. 

e.g. - delete apps in a team 
```
> heroku demokit:apps:delete -t my_team
 ▸    This is a destructive action and will destroy 5 apps
 ▸    To proceed, type delete or re-run this command with --confirm delete

> delete
Deleting app vast-cliffs-83310... done
Deleting app desolate-oasis-18389... done
Deleting app safe-cove-19500... done
Deleting app mysterious-wave-13699... done
Deleting app blooming-lake-46070... done

```

### demokit:apps:deploy
```
Usage: heroku demokit:apps:deploy

Deploys the 8 '<language>-getting-started' applications from the Heroku Github repository.

 -r, --region # what region this should be placed in
 -t, --team   # team to invite users to

```
This will deploy the getting started language projects for you. Useful when you want to quickly show a dashboard that is populated with multiple types of languages.

e.g. - Deploying to Personal Apps in US region
```
heroku demokit:apps:deploy 
'Deploying https://github.com/heroku/node-js-getting-started/tarball/master'
'Deploying https://github.com/heroku/python-getting-started/tarball/master'
'Deploying https://github.com/heroku/java-getting-started/tarball/master'
'Deploying https://github.com/heroku/php-getting-started/tarball/master'
'Deploying https://github.com/heroku/ruby-getting-started/tarball/master'
'Deploying https://github.com/heroku/clojure-getting-started/tarball/master'
'Deploying https://github.com/heroku/go-getting-started/tarball/master'
'Deploying https://github.com/heroku/scala-getting-started/tarball/master'
'We have queued 8 apps for deploy'
```

### demokit:apps:scaleDynos

```
Usage: heroku demokit:apps:scaleDynos

Scales all dynos to either zero or the given quantity, will operate on Personal Apps if not supplied a team.

 -q, --quantity QUANTITY # number of dynos to scale apps to
 -t, --team TEAM         # operate on apps belonging to this team only
```

Use this command when you want to scale all the dyno formations to all the apps in a team to the same number. Most useful for scaling all apps to zero at the end of training so cost is not incurred for running dynos. 
When scaling it will preserve the size of each dyno formation (i.e. Standard-1X will stay a Standard-1X)

e.g - Scaling all dynos to zero in team 'my_team'
```
> heroku demokit:apps:scaleDynos -t my_team
'Scaling all dynos for team my_team to 0'
'Gathering dyno formations for all apps....'
'Scaling dyno formations for all apps....'
'Complete... scaled all apps'
App Name                   Dyno Type  Quantity  Size
─────────────────────────  ─────────  ────────  ───────────
fierce-badlands-10010      web                  Standard-1X
hidden-springs-21754       worker               Standard-1X
safe-tor-14566             web                  Standard-1X
afternoon-basin-30749      web                  Standard-1X
pure-stream-56975          console              Standard-1X
warm-ridge-65304           web                  Standard-1X
still-peak-42092           web                  Standard-1X
afternoon-anchorage-49612  web                  Standard-1X
```

### demokit:resources

```
Usage: heroku demokit:resources

Provides an output of currently used resources for this Team.

 -t, --team TEAM     # team used to perform the aggregations on.
 -v, --verbose       # display apps with addons and associtated plans.
```
Will provide a list of resources for either a specific team or your Personal Apps that are attached to apps. 

e.g. - resources for my team 'my_team'
```
> heroku demokit:resources -t my_team
'Gathering apps for my_team '
'Gathering addons for 3 apps'
=== Total Apps : 3
=== Apps with addons : 3
=== Distinct services : 2
=== Distinct plans : 3
Distinct plans: heroku-kafka:beta3-mt-0
                heroku-postgresql:hobby-dev
                heroku-postgresql:hobby-basic
Run with -v flag to see app and addon details
```

e.g. - verbose resources for Personal Apps
```
> heroku demokit:resources -v
'Gathering apps for Personal Apps '
'Gathering addons for 3 apps'
App                    Addon Name                    Addon Plan                     Billing App
─────────────────────  ────────────────────────────  ─────────────────────────────  ─────────────────────
mt-kafka-client        kafka-triangular-19944        heroku-kafka:beta3-mt-0        mt-kafka-generator
mt-kafka-generator     postgresql-aerodynamic-76854  heroku-postgresql:hobby-dev    mt-kafka-generator
mt-kafka-generator     kafka-triangular-19944        heroku-kafka:beta3-mt-0        mt-kafka-generator
tranquil-sierra-44531  postgresql-curly-66875        heroku-postgresql:hobby-basic  tranquil-sierra-44531
```

### demokit:users

```
Usage: heroku demokit:users

Show users from a specific team

 -t, --team TEAM     # [REQUIRED] team you want to display users associated with
 ```

This command will count and display all the users that have access to the specified team. 

e.g. - Users for team my_team
 ```
heroku demokit:users -t my_team
'Gathering users .... '
User Email                       Role
───────────────────────────────  ────────────
<<USERS>>
=== Total Users : 23
```

### demokit:users:invite

```
Usage: heroku demokit:users:invite

Read csv of user details and invite to the specified team.

 -f, --file FILE     # [REQIURED] path to csv file that has, per line, (email, [member|admin|viewer]) entries
 -t, --team TEAM     # [REQIURED] team to invite users to
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
Usage: heroku demokit:users:remove

Will remove all users (except salesforce.com and heroku.com users) from the given Team.

 -a, --all           # include salesforce.com and heroku.com users in removal
 -t, --team TEAM     # [REQUIRED] team to remove users from
 --remove REMOVE     # remove users without validation
```

Command will look for all users that are part of the team used for training. Any user that doesn't have an heroku.com or salesforce.com email address will be removed from the Team. 
