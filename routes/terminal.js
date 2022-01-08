/* * */
/* IMPORTS */
const router = require('express').Router();
const { validate } = require('../models/POSFeedback');
const spreadsheetAPI = require('../services/spreadsheetAPI');
const moment = require('moment');
const config = require('config');

/* * */
/* * */
/* * */
/* * * * * */
/* ROUTES FOR 'FEEDBACK TERMINAL' */
/* * */
/* * */

/* * */
/* * */
/* * * * * */
/* POST method for [/POSF] */
/* Validates the request. */
/* Stores the image in storage. */
/* Creates a new item in the database. */
/* Responds with the newly created item */
router.post('/', async (req, res) => {
  /* Validation */
  // Validate the request
  // Continue if no errors are found
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Retrieve the Document ID from settings
  const documentID = config.get('google-spreadsheets.document-id');

  // Instantiate a new model of Feedback
  let feedback = {
    // Unique identifier for later reference
    id: Date.now().toString(),
    // The session of the feedback
    session: req.body.session,
    // The location where feedback was submitted
    location: req.body.location,
    // Timestamp
    date: moment().format('[=DATE(]YYYY[,]MM[,]DD[)]'),
    time: moment().format('[=TIME(]HH[,]mm[,0)]'),
    // The first question title
    firstQuestionTitle: req.body.firstQuestionTitle,
    // The first question answer
    firstQuestionAnswerIcon: req.body.firstQuestionAnswer.icon,
    firstQuestionAnswerLabel: req.body.firstQuestionAnswer.label,
    firstQuestionAnswerValue: req.body.firstQuestionAnswer.value,
  };

  // Save feedback to GSheets
  await spreadsheetAPI.addNewRow(documentID, feedback.session, feedback);

  // Send the created feedback back to the client
  res.send(feedback);
});

/* * */
/* * */
/* * * * * */
/* PUT method for [/POSF/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put('/:id', async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rows = await spreadsheetAPI.getRows();

  consolg.log(rows);

  // Try saving to the database
  // const item = await POSFeedback.findByIdAndUpdate(req.params.id /* Which item to update */, req.body /* What is to change */, { new: true } /* Respond with the updated document */);

  res.send(req.body);
});

/* * */
/* Export router for [/POSF/] */
module.exports = router;
