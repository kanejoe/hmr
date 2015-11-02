"use strict";
var bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var co = require("co");

export default function(app, mongoose) {
  var UserSchema = new Schema({
    email: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String, require: true },
    timeCreated: { type: Date, default: Date.now }
  }, {
    toJSON: {
      transform: function(doc, ret, options) {
        delete ret.password;
      },
    },
  });

  /**
   * Middlewares
   */
  UserSchema.pre("save", function(done) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
      return done();
    }

    co.wrap(function*() {
      try {
        var salt = yield bcrypt.genSalt();
        var hash = yield bcrypt.hash(this.password, salt);
        this.password = hash;
        done();
      } catch (err) {
        done(err);
      }
    }).call(this).then(done);
  });

  /**
   * Methods
   */
  UserSchema.methods.validatePassword = function(password, hash, done) {  // where is the hash stored?
    bcrypt.compare(password, hash, function(err, res) {
      done(err, res);
    });
  };

  /**
   * Statics
   */

   UserSchema.statics.encryptPassword = function(password, done) {  // has been checked against https://github.com/dcodeIO/bcrypt.js
     bcrypt.genSalt(10, function(err, salt) {  // alternative: crypto.createHmac('sha1',  this.salt).update(password).digest('hex')
       if (err) {
         return done(err);
       }

       bcrypt.hash(password, salt, function(err, hash) {
         done(err, hash);
       });
     });
   };

  UserSchema.index({ email: 1 }, { unique: true });
  UserSchema.index({ timeCreated: 1 });
  UserSchema.set('autoIndex', (app.get('env') === 'development'));

  // Model creation
  app.db.model("User", UserSchema);
}
