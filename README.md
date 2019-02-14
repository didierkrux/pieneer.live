# Pieneer Live
Live Presentation made Interactive and Easy

## Group member

- [Didier Krux](https://github.com/didierkrux)
- [Ivan Oung](https://github.com/ivanoung)
- [Lucas Ng](https://github.com/LucasNG521)

## Project Map and Notes

[Trello Board](https://trello.com/b/8xI6rqJD/accelerator-cohort-module-2)

## Technology used

- AWS EC2 for hosting
- Node.js (express, passport, socket.io, redis, knex, ppt-png)
- Bootstrap
- JQuery
- Chart.js
- zwibbler? (canvas painting)

--- 

## version 0.1 May 6, 2018 (Ivan)

To establish update logs, adding packages like (Socket.io, passport, pg, knex and hbs). 
Already ran a test on using socket.io to update poll options, which the only thing that was left for the charts is to find a way to store the information of the table.

### Added

- npm install-ed
    - Chart.js
    - hbs
    - socket.io & socket.io-client
    - pg
    - knex
    - passport (local and facebook)
- Change log for the project
- Socket routes

### Changed

- Rerouting with viewRouter


## version 0.1 May 7, 2018 (Lucas)

Create table with knex

### Added

- npm dotenv
- migrations file 
    - presenter
    - presentation
    - pages
    - polls
    - result
    - q_a

## version 0.1 May 8, 2018 (Lucas)

database chang and added seeds file

### Added

- seeds 
    - all-table

### Changed

- migrations file (type)
    - presenter
    - presentation
    - pages
    - polls
    - result
    - q_a

## version 0.1 May 8, 2018 (Didier)

Refactorized the layout of the canvas, finished the tool kit for live-presentation, working on the next layout which will be where the presentor presents his/her poll selection.

### Added
### Changed
### Removed

## version 0.1 May 9, 2018 (Ivan)

Refactorized the layout of the canvas, finished the tool kit for live-presentation, working on the next layout which will be where the presentor presents his/her poll selection.

### Added
### Changed

- Adding more information into the seed flie for a more thorough testing env.

### Removed

## version 0.1 May 9, 2018 (Lucas)

### Added
- npm install
    - passport-linkedin
    - passport-google-oauth20

- passport.js
    - passport.use(facebook, google, linkedin)

- viewRoures.js
    -router passport (facebook, google, linkedin)

### changed
- login.html and signup.html moved to index.html 

### Problem
- passport-facebook/linkedin didn't work 

## version 0.1 May 9, 2018 (Ivan)

Today's focus was to setup the database, setting up the correct seeding file for the right data to go through with the testing. Also, the pathing of the API (routers->apiRoutes) is coming into shape, where the design of the actual wireframe is required to help visualize what to make out of the database. 
Also the mobile and web connection is established, where clicking on the cellphone will trigger changes on the website instantly, the only thing that is missing is to push the vote counts into the database as well as recalling the piece of data from SQL.

### Added
- API to access the database
- Connection between mobile and the web version

### changed
- Seeding content

### Problem
- Vote counts are static, serving from the front end instead of sending it to backend


## version 0.1 May 10, 2018 (Lucas)

changed apiRoutes.js and added body-parser to app.js. The REST is working and esay to read.

### Added
- sign-out google 

### Changed
- apiRoutes content

### Problem


## version 0.1 May 11, 2018 (Lucas)

Added database table and maked change.trying to do local-login and username come to req.possport.name(if user is loggedin) !

### Added
-  magirations files
    - login table

-  npm install bcrypt

- apiRoutes
    - added router-login

### Changed
- index.html
    - changed edit-info modal content (now is working and connect to db)

- seeds file
    - changed some columns

### Problem
- local-login
    - i don't know how to route login to button/modal (login without login.html)
    - the index.html missing sign-up function 
- google-login
    - cuz we missing login page google-login won't callback to homepage.


## version 0.1 May 12, 2018 (Ivan)
Focus on fixing the pathing and the API routes, also added the API paths to add images and remove images.

### Added
- API to access the database
- Connection between mobile and the web version

### changed
- Seeding content

### Problem
- Vote counts are static, serving from the front end instead of sending it to backend

## version 0.1 May 13, 2018 (Lucas)

focus on passport.js (local-login and social-login) Now is working!!
still working on google-login in same page .

### Added


### Changed
- npm install passport-linkedin-auth2
    - uninstall passport-linkedin, changed to passport-linkedin-auth2 

- viewRouter
    - without class

- app.js
    - app.js:46:47 chaged content (i don't know will it affect anything, but still working)

### Problem
- passport login is working but i have a problem about router, when i loged-in will not route to homepage, i need michael!!!
