'use strict';

/* * * * * */
/* FEEDBACK */
/* * */

/* * */
/* IMPORTS */
const Joi = require('joi');

/* * */
/* JOI VALIDATION SCHEMA */
/* A validation schema where Feedback properties options are defined. */
const Feedback = Joi.object({
  //
  /* Where Feedback is being collected. */
  location: Joi.string().max(30).required().label('Location'),

  /* The first question. */
  firstQuestionTitle: Joi.string().max(50).label('First Question Title'),
  firstQuestionAnswerIcon: Joi.string().max(50).allow('').label('First Question Answer - Icon'),
  firstQuestionAnswerLabel: Joi.string().max(50).allow('').label('First Question Answer - Label'),
  firstQuestionAnswerValue: Joi.any().label('First Question Answer - Value'),

  /* The second question. */
  secondQuestionTitle: Joi.string().max(50).label('Second Question Title'),
  secondQuestionAnswerIcon: Joi.string().max(50).allow('').label('Second Question Answer - Icon'),
  secondQuestionAnswerLabel: Joi.string().max(50).allow('').label('Second Question Answer - Label'),
  secondQuestionAnswerValue: Joi.any().label('Second Question Answer - Value'),
});

/* * */
/* Export object */
module.exports = Feedback;
