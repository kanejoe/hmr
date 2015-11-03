import express from "express";
import path from "path";
import serveStatic from "serve-static";
import bodyParser from "body-parser";
import session from "express-session";
import favicon from "serve-favicon";
import compression from "compression";
import morgan from "morgan";
import passport from "passport";
import mongoose from "mongoose";

delete process.env.BROWSER; // http://stackoverflow.com/a/30355080/578667

/**
 * Config
 */
const config = require("../../config");
const app = express();
app.config = config;

/**
 * Connect to mongo
 */

var mongoUri;
switch(app.get('env')) {
  case 'development':
    mongoUri = config.mongodb.developmentUri;
    break;
  case 'production':
    mongoUri = config.mongodb.productionUri;
    break;
  default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}

app.db = mongoose.createConnection( mongoUri, {server:{auto_reconnect:true}} );
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function (conn) {
  console.log( "mongodb started..." )
});
app.db.on('disconnected', function() {
  app.db = mongoose.connect( mongoUri, {server:{auto_reconnect:true}} );
});

// set up Jade
app.set('views', './views');
app.set('view engine', 'jade');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
app.locals.settings['x-powered-by'] = false;  // makes no sense to advertise your technology stack like that

/**
 * Express Middleware
 */
app.use( morgan(app.get("env") === "production" ? "combined" : "dev") );
app.use( compression() );
app.use( bodyParser.urlencoded({ extended:true }) );
app.use( bodyParser.json() );
//app.use( favicon(path.resolve(__dirname, '..', '..', 'src', 'images/favicon.ico')) );

/**
 * config data models
 */
require('./models')(app, mongoose);

/**
 * set up passport
 */
//require('../../config/passport')(app, passport);

// Routes
import React                              from 'react';
import ReactDOMServer, { renderToString } from 'react-dom/server';
import { createLocation }                 from 'history';
import { Router, RoutingContext, match }  from 'react-router';
import { Provider }                       from 'react-redux';
import Immutable, { Map } from 'immutable';

import configureStore                     from '../shared/store/configureStore';
import routes                             from "../shared/sharedRoutes";

require('./routes')(app, passport);
app.get('/*', function (req, res, next) { // review: https://github.com/coodoo/react-redux-isomorphic-example/blob/master/js/boot-client.js  (partic routing)
  const outcome = {};

  const getReqs = function(callback) {
    req.app.db.models.Reqs
      .find({})
      .lean() // vital to weed out extraneous info
      .exec( function(err, reqs) {
        if (err) return callback(err, null);
        outcome.reqs = reqs;
        //console.dir(reqs)
        return callback(null, 'reqs');
    });
  }

  const asyncFinally = function(err, results) {
    if (err) return next(err);
    let { users, reqs } = outcome;
    let store = configureStore({ requisitions: {reqs: reqs}, users, data: reqs.map(r => [r._id, Map(r)] ) });
    let location = createLocation( req.url );

    // https://github.com/rackt/react-router/blob/master/docs/API.md#matchlocation-cb
    match({ routes, location }, (err, redirectLocation, renderProps) => {
      if (err) { console.error(err); return res.status(500).end('Internal server error'); }
      if (!renderProps) return res.status(404).json({'sharedRoutes': sharedRoutes, 'location': location});  // 'Not found - routes did not match location.'
      //return res.json(renderProps)

      const initialComponent = (
        <Provider store={store} key='provider'>
          <RoutingContext {...renderProps} />
        </Provider>
      );
      const componentHTML = renderToString(initialComponent);
      const initialState = store.getState();

      res.render('index', {
        content: componentHTML,
        state: escape( JSON.stringify( initialState ) )
      });
    });
  };

  require('async').series([getReqs], asyncFinally);
});

var server = app.listen(app.config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

console.log("Environment: " + app.config.env);
module.exports = app;
