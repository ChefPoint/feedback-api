/* * */
/* IMPORTS */
const Joi = require('joi');
const mongoose = require('mongoose');

/* * */
/* * */
/* * */
/* * * * * */
/* MONGO DB MODEL */
/* * */
/* * */
/* Schema for MongoDB ["POSFeedback"] Object */
/* This Schema must match Joi */
const POSFeedback = mongoose.model(
  'POSFeedback',
  new mongoose.Schema({
    timestamp: {
      type: Date,
      maxlength: 255,
      default: () => new Date(Date.now()).toISOString(),
    },

    // Feedback Collection Session
    session: {
      type: String,
      maxlength: 30,
      required: true,
    },

    // Location where POSFeedback is being collected
    location: {
      type: String,
      maxlength: 30,
      required: true,
    },

    // First Question
    firstQuestionTitle: {
      type: String,
      maxlength: 30,
      required: true,
    },
    firstQuestionAnswer: {
      icon: {
        type: String,
        maxlength: 30,
        required: true,
      },
      label: {
        type: String,
        maxlength: 30,
      },
      value: {
        type: Number,
        minlength: 1,
        maxlength: 4,
        required: true,
      },
    },

    // Second Question
    secondQuestionTitle: {
      type: String,
      maxlength: 30,
    },
    secondQuestionAnswer: {
      icon: {
        type: String,
        maxlength: 30,
      },
      label: {
        type: String,
        maxlength: 30,
      },
      value: {
        type: String,
        maxlength: 30,
      },
    },
  })
);

/* * */
/* * */
/* * */
/* * * * * */
/* JOI VALIDATION SCHEMA */
/* * */
/* * */
/* Schema for Joi ["POSFeedback"] Object validation */
/* This Schema must match MongoDB */
const validation_schema = Joi.object({
  // Location where POSFeedback is being collected
  session: Joi.string().max(30).label('Feedback Collection Session'),

  // Location where POSFeedback is being collected
  location: Joi.string().max(30).label('Location'),

  // First Question
  firstQuestionTitle: Joi.string().max(30).label('First Question Title'),
  firstQuestionAnswer: Joi.object({
    icon: Joi.string().max(50).allow('').label('First Question Answer - Icon'),
    label: Joi.string().max(50).allow('').label('First Question Answer - Label'),
    value: Joi.number().min(1).max(15).allow('').label('First Question Answer - Value'),
  }).label('First Question Answer'),

  // Second Question
  secondQuestionTitle: Joi.string().max(30).label('Second Question Title'),
  secondQuestionAnswer: Joi.object({
    icon: Joi.string().max(50).allow('').label('Second Question Answer - Icon'),
    label: Joi.string().max(50).allow('').label('Second Question Answer - Label'),
    value: Joi.string().max(50).allow('').label('Second Question Answer - Value'),
  }).label('Second Question Answer'),
});

function validate(request) {
  validation_schema.validate(request);
  // return Joi.validate(request, validation_schema);
}
/* * * * * * */
/* * */

/* * */
/* Export functions */
exports.POSFeedback = POSFeedback;
exports.validate = validate;
