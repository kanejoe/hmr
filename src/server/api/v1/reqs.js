'use strict';
import _ from 'lodash';
import s from 'underscore.string';
import Joi from 'joi';
import mongoose from 'mongoose';
import async from 'async';
import path from 'path';
import Moment from 'moment';
import { EventEmitter } from 'events';  // var workflow = new (require('events').EventEmitter)();

/**
 * app.get('/reqs/')
 * GET - show all reqs
 */

exports.showAllReqs = function(req, res, next){

  var outcome = {};
  // need here to show the data for all clients -- same as: /api/v1/clients/
  var getAllReqs = function(callback) {
    req.app.db.models.ReqsEdition
      .find({})
      .exec( function(err, reqs) {
        if (err) return callback(err, null);
        outcome.reqs = reqs;
        //console.dir(reqs)
        return callback(null, 'done');
    });
  };

  // then render the page
  var asyncFinally = function(err) {
    if (err) return next(err);
    return res.json(outcome.reqs)
  };

  require('async').parallel([getAllReqs], asyncFinally);
};


// global options
var JOIoptions = {
  abortEarly: false,
  allowUnknown: true
}


// validation schema for put and post
var JOIschema = Joi.object().keys({
  title: Joi.string().required().min(8).label('Title'),
});

var fieldsToSet = {
  title: ''
};

/**
 * app.post('/api/v1/reqs/')
 * POST - new set of reqs
 */

exports.createReqs = function(req, res, next){
  const workflow = new EventEmitter();

  workflow.on('initial', function(){
    workflow.fieldsToSet = fieldsToSet;
    workflow.emit('setFields');
  });

  // input manipulation function
  workflow.on('setFields', function() {
    workflow.fieldsToSet.title = s(req.body.title).clean().value();
    workflow.emit('validate');
  });

  // validation phase -- check for duplicates
  workflow.on('validate', function() {
    Joi.validate(workflow.fieldsToSet, JOIschema, JOIoptions, function (err, value) {
      if (err) return res.status(403).json({ error: err });
      else workflow.emit('addReqs');
    });
  });

  // create the new record
  workflow.on('addReqs', function() {
    req.app.db.models.Reqs.create(workflow.fieldsToSet, function(err, reqs) {
      if (err) return res.status(404).json({error: err});
      workflow.emit('result', reqs._id)
    });
  });

  workflow.on('result', function(id){
    req.app.db.models.Reqs
      .findById(id)
      //.select('clients dates description fileref userAccounts category')
      .exec( function(err, reqs) {
        if (err) return res.status(404).json({error: err});
        return res.json(reqs);
    });
  })

  workflow.emit('initial');
};

/**
 * app.put('/api/v1/reqs/:id')
 * PUT - edit reqs header
 */

exports.editReqs = function(req, res, next){
  const workflow = new EventEmitter();

  workflow.on('initial', function(){
    workflow.fieldsToSet = fieldsToSet;
    workflow.emit('setFields');
  });

  // input manipulation function
  workflow.on('setFields', function() {
    //console.dir(req.body)
    workflow.fieldsToSet.title = s(req.body.title).clean().value();
    workflow.emit('validate');
  });

  // validation phase
  workflow.on('validate', function() {
    Joi.validate(workflow.fieldsToSet, JOIschema, JOIoptions, function (err, value) {
      if (err) return res.status(403).json({ error: err });
      else workflow.emit('duplicateTitleCheck');
    });
  });

  workflow.on('duplicateTitleCheck', function() {
    req.app.db.models.Reqs.findOne({ title: workflow.fieldsToSet.title, _id: { $ne: req.params.id } }, function(err, req) {
      if (err) return res.status(403).json({ error: err });
      if (req) return res.status(403).json({ error: `"${workflow.fieldsToSet.title}" has already been taken as a title.` });
      workflow.emit('update');
    });
  });

  workflow.on('update', function() {
    req.app.db.models.Reqs
      .findOneAndUpdate(
        { '_id': req.params.id },
        { title: workflow.fieldsToSet.title }
      )
      .exec(function(err, req){
        if (err) return res.status(403).json({ error: err });
        workflow.emit('result', req._id);
      })
  });

  workflow.on('result', function(id){
    req.app.db.models.Reqs
      .findById(id)
      //.select('')
      .exec( function(err, reqs) {
        if (err) return res.status(404).json({error: err});
        return res.json(reqs);
    });
  });

  workflow.emit('initial');
};


/**
 * app.del('/api/v1/reqs/:id')
 * DELETE - reqs header
 */

exports.deleteReqs = function(req, res, next){ // need to validate two params here instead of one
  const workflow = new EventEmitter();
  var schema = Joi.string().min(24).max(24);  // 24 character string (mongoid)

  workflow.on('validateParam', function() {
    Joi.validate( req.params.id, schema, function (err, id) {
      if (err) {
        err = err.details[0].message;
        return res.status('403').json({ error: err });
      }
      workflow.id = id;
      workflow.emit('results', id);
    });
  });

  workflow.on('results', function(id){
    req.app.db.models.Reqs
      .findById(id)
      .remove()
      .exec( function(err, reqs) {
        if (err) return res.status(404).json({error: err});
        return res.json(reqs);
    });
  })

  workflow.emit('validateParam');
};
