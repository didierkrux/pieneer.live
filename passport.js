const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
// const bcrypt = require('./bcrypt');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./mydb.sqlite"
  }
});

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('local-signup', new LocalStrategy(
    async (usersname, password, done) => {
        // [REVIEW] should use transaction
      try {
        let users = await knex('users').where({ usersname: usersname });
        if (users.length > 0) {
          return done(null, false, { message: 'Username already taken' });
        }
        // let hash = await bcrypt.hashPassword(password)
        const newUser = {
          usersname: usersname,
          password: password    // hash
        };
        let user = await knex('users').insert(newUser).returning(['id', 'usersname']);
        done(null, user[0]);
      } catch (err) {
        done(err);
      }
    }
  ));


  passport.use('local-login', new LocalStrategy(
    async (username, password, done) => {
      try {
        let users = await knex('users').where({ usersname: 'didier' })
        // console.log(users);
        if (users.length == 0) {
          return done(null, false, { message: 'Incorrect credentials' });
        }
        let user = users[0];
        return done(null, user);    // hardcode user
        // console.log(user);
        // console.log(password);
        // console.log(user.password);
        // let result = await bcrypt.checkPassword(password, user.password);
        // console.log(result);
        // if (result) {
        //   return done(null, user);
        // } else {
        //   return done(null, false, { message: 'Incorrect credentials' });
        // }
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  ));

  passport.use('facebook', new FacebookStrategy({
    clientID: '2117364898475037',
    clientSecret: '46f25ce454c6f67a62929f1fa4b6bce9',
    callbackURL: "https://pieneer.live/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // console.log(profile);

    // [REVIEW] use transaction
      let user = await knex('users').first().where('social_login', profile.id)

      if (user) {
        done(null, user);
      } else {
        let newUser = await knex('users').insert({
          social_login: profile.id,
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
          email: profile.user.email
        }).returning(['id', 'first_name'])
        done(null, newUser[0]);
      }
    }
  ));

  passport.use('google', new GoogleStrategy({
    clientID: '976623563011-b70ot73gqn26b87jc02jacdg726tce7s.apps.googleusercontent.com',
    clientSecret: 'sJRiDC5hZ6LIwJYr16b-21g1',
    callbackURL: "https://pieneer.live/auth/google/callback"
  },
    async (accessToken, refreshToken, profile, done) => {

      // console.log(profile);
      let user = await knex('users').first().where('social_login', profile.id)

      if (user) {
        done(null, user);
      } else {
        let newUser = await knex('users').insert({
          social_login: profile.id,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails.value
        }).returning(['id', 'first_name'])
        done(null, newUser[0]);
      }

      // const newUser = {
      //   usersname: usersname,
      //   password: hash
      // };
      // knex('users').insert(newUser).returning('id');
      // done(null, newUser);

      // .then(() => {
      //   console.log('ok!');
      // }).catch(err => {
      //   console.log(err);
      // })

    }));

  passport.use('linkedin', new LinkedInStrategy({
    clientID: '81ek2wlffsjab8',
    clientSecret: 'cIlS1KwTOGQAVE9g',
    callbackURL: "https://pieneer.live/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
  },
   async (token, tokenSecret, profile, done) => {

      let user = await knex('users').first().where('social_login', profile.id)

      if (user) {
        done(null, user);
      } else {
        let newUser = await knex('users').insert({
          social_login: profile.id,
          first_name: profile.r_basicprofile.first-name,
          last_name: profile.r_basicprofile.last-name,
          email: profile.r_emailaddress.email
        }).returning(['id', 'first_name'])
        done(null, newUser[0]);
      }
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let users = await knex('users').where({ id: id });
    // console.log(users);
    if (users.length == 0) {
      return done(new Error(`Wrong user id ${id}`));
    }
    let user = users[0];
    // console.log(user);
    return done(null, user);
  });
};
