'use_strict';

/* * */
/* IMPORTS */
const router = require('express').Router();
const { validate } = require('../models/POSFeedback');
const spreadsheetAPI = require('../services/spreadsheetAPI');
const moment = require('moment');

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
    firstQuestionAnswerIcon: req.body.firstQuestionAnswerIcon,
    firstQuestionAnswerLabel: req.body.firstQuestionAnswerLabel,
    firstQuestionAnswerValue: req.body.firstQuestionAnswerValue,
  };

  // Save feedback to GSheets
  await spreadsheetAPI.addNewRow(feedback.session, feedback);

  // Send the created feedback back to the client
  res.send(feedback);
});

/* * */
/* * */
/* * * * * */
/* PUT method for [/POSF/:id] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.put('/', async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  console.log('error', error);
  if (error) return res.status(400).send(error.details[0].message);

  const rows = await spreadsheetAPI.getRows(req.body.session);

  for (const row of rows) {
    if (row.id == req.body.id) {
      row.secondQuestionTitle = req.body.secondQuestionTitle;
      row.secondQuestionAnswerIcon = req.body.secondQuestionAnswerIcon;
      row.secondQuestionAnswerLabel = req.body.secondQuestionAnswerLabel;
      row.secondQuestionAnswerValue = req.body.secondQuestionAnswerValue;
      row.save();
    }
  }

  res.send(req.body);
});

/* * */
/* Export router for [/POSF/] */
module.exports = router;
