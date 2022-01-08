/* * */
/* IMPORTS */
const Joi = require('joi');

/* * */
/* * */
/* * */
/* * * * * */
/* MONGO DB MODEL */
/* * */
/* * */
/* Schema for MongoDB ["POSFeedback"] Object */
/* This Schema must match Joi */
// const POSFeedback = mongoose.model(
//   'POSFeedback',
//   new mongoose.Schema({
//     timestamp: {
//       type: Date,
//       maxlength: 255,
//       default: () => new Date(Date.now()).toISOString(),
//     },

//     // Feedback Collection Session
//     session: {
//       type: String,
//       maxlength: 30,
//       required: true,
//     },

//     // Location where POSFeedback is being collected
//     location: {
//       type: String,
//       maxlength: 30,
//       required: true,
//     },

//     // First Question
//     firstQuestionTitle: {
//       type: String,
//       maxlength: 30,
//       required: true,
//     },
//     firstQuestionAnswer: {
//       icon: {
//         type: String,
//         maxlength: 30,
//         required: true,
//       },
//       label: {
//         type: String,
//         maxlength: 30,
//       },
//       value: {
//         type: Number,
//         minlength: 1,
//         maxlength: 4,
//         required: true,
//       },
//     },

//     // Second Question
//     secondQuestionTitle: {
//       type: String,
//       maxlength: 30,
//     },
//     secondQuestionAnswer: {
//       icon: {
//         type: String,
//         maxlength: 30,
//       },
//       label: {
//         type: String,
//         maxlength: 30,
//       },
//       value: {
//         type: String,
//         maxlength: 30,
//       },
//     },
//   })
// );

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
  // POSFeedback ID
  id: Joi.string().label('Feedback ID'),
  // Location where POSFeedback is being collected
  session: Joi.string().max(30).required().label('Feedback Collection Session'),

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
  // return Joi.validate(request, validation_schema);
}
/* * * * * * */
/* * */

/* * */
/* Export functions */
// exports.POSFeedback = POSFeedback;
exports.validate = validate;
