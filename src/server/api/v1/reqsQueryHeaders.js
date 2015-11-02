import _ from 'lodash';
import s from 'underscore.string';
import Joi from 'joi';
import mongoose from 'mongoose';
import async from 'async';
import path from 'path';
import Moment from 'moment';
import { EventEmitter } from 'events';

// global options
var JOIoptions = {
  abortEarly: false,
  allowUnknown: true
}


// validation schema for put and post
var JOIschema = Joi.object().keys({
  header: Joi.string().required().min(3).label('Header'),
});

var fieldsToSet = {
  header: ''
};


/**
 * app.post('/api/v1/reqs/:reqsId/header/')
 * POST - new reqs header
 */

exports.createReqsQueryHeader = function(req, res, next){

  const workflow = new EventEmitter();

  workflow.on('initial', function(){
    workflow.fieldsToSet = fieldsToSet;
    workflow.emit('setFields');
  });

  // input manipulation function
  workflow.on('setFields', function() {
    workflow.fieldsToSet.header = s(req.body.header).clean().value();
    console.dir(workflow.fieldsToSet)
    //workflow.fieldsToSet.order = parseInt(req.body.order, 10);
    workflow.emit('validate');
  });

  // validation phase
  workflow.on('validate', function() {
    Joi.validate(workflow.fieldsToSet, JOIschema, JOIoptions, function (err, value) {
      if (err) return res.status(403).json({ error: err });
      else workflow.emit('addReqsHeader');
    });
  });

  // create the new record
  workflow.on('addReqsHeader', function() {
    req.app.db.models.Reqs.findOneAndUpdate(
      { '_id': req.params.reqId }
      , { $push : { 'queries' : {
        header : workflow.fieldsToSet.header,
        //order : workflow.fieldsToSet.order
      }}}
    )
    .exec(function(err, reqs) {
      if (err) return res.status(404).json({error: err});
      workflow.emit('result', reqs._id)
    });
  });

  workflow.on('result', function(id){
    req.app.db.models.Reqs
      .findById(id)
      //.select('') // maybe just return the queries
      .exec( function(err, reqs) {
        if (err) return res.status(404).json({error: err});
        return res.json(reqs);
    });
  })

  workflow.emit('initial');
};
