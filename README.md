# Intro

aTable (short for availability table) is collaboration tool for distributed teams with the main purpose to solve problem of remote teams that don't have fixed working hours by providing table of when and what your coworkers are working on.
 
Application consists of several parts.  
 Main module of the app is, as mentioned, availability table where you can see your coworkers status for the given day.  
You can choose on which task you're about to work for specified time and that time entry is going to be assigned to the given task.  
Application supports real time chat, profile and team creation, tasks list and real time notification system.

# Where to start

Clone the repo:

```bash
git clone git:repo
```

Install dependencies:
```bash
npm i
```

First, you will need to visit `app-config.ts` that can be found in the root of project.

There you will find following properties:

* `localUrl` - Url of your local running instance of [atable-backend](https://google.com).  
* `prodDomain` - Domain of remotely hosted instance of `atable-backend`. If you want to connect to it while developing.

* `data.times` - This is the list of times that are in charge of displaying the main module `availability table`. This part should and will be improved in terms of calculating the values instead of hard-coding them.

# Next steps

## Develop with server hosted locally

```bash
npm run devLocal
```

## Develop with server hosted remotely

```bash
npm run devRemote
```

## Build

To build the project run:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.  
Use the `--prod` flag for a production build.

## Running unit tests

```bash
ng test
``` 

to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

```bash
ng e2e
```
to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

if you're interested to find out more, contact us at atable@intreks.com

## Happy Coding
