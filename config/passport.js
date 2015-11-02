"use strict";
var LocalStrategy = require("passport-local").Strategy;
var User = require("mongoose").model("User");

var serialize = function(user, done) {
  done(null, user._id);
};

var deserialize = function(id, done) {
  User.findById(id, done);
};

exports = module.exports = function(app, passport) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      //var conditions = { isActive: true };  // can only login when isActive
      //conditions.email = email;  // unsure why this is necessary
      app.db.models.User.findOne(conditions, function(err, user) {
        if (err) return done(err, null);
        if (!user) return done(null, false, { message: 'user or password invalid (or account inactive)' });
        if (!user.password) return done(null, false, { message: 'user account not fully set up' });

        app.db.models.User.validatePassword(password, user.password, function(err, isValid) {
          if (err) return done(err, null);
          if (!isValid) return done(null, false, { message: 'user or password invalid' });
          return done(null, user);
        });
      });
    }
  ));
};
