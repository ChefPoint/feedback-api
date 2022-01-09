/* * */
/* IMPORTS */
const Joi = require('joi');

/* * */
/* * * * * */
/* JOI VALIDATION SCHEMA */
/* * */
/* * */
/* Schema for Joi ["POSFeedback"] Object validation */
/* This Schema must match MongoDB */
const validation_schema = Joi.object({
  // POSFeedback ID
  id: Joi.string().label('Feedback ID'),

  // Location where POSFeedback is being collected
  location: Joi.string().max(30).required().label('Location'),

  // First Question
  firstQuestionTitle: Joi.string().max(30).label('First Question Title'),
  firstQuestionAnswerIcon: Joi.string().max(50).allow('').label('First Question Answer - Icon'),
  firstQuestionAnswerLabel: Joi.string().max(50).allow('').label('First Question Answer - Label'),
  firstQuestionAnswerValue: Joi.any().label('First Question Answer - Value'),

  // Second Question
  secondQuestionTitle: Joi.string().max(30).label('Second Question Title'),
  secondQuestionAnswerIcon: Joi.string().max(50).allow('').label('Second Question Answer - Icon'),
  secondQuestionAnswerLabel: Joi.string().max(50).allow('').label('Second Question Answer - Label'),
  secondQuestionAnswerValue: Joi.any().label('Second Question Answer - Value'),
});

function validate(request) {
  return validation_schema.validate(request);
}
/* * * * * * */
/* * */

/* * */
/* Export functions */
exports.validate = validate;
