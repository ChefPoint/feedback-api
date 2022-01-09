'use_strict';

/* * */
/* IMPORTS */
const router = require('express').Router();
const moment = require('moment');
const { validate } = require('../models/POSFeedback');
const spreadsheetAPI = require('../services/spreadsheetAPI');

/* * */
/* * */
/* * */
/* * * * * */
/* ROUTES FOR 'FEEDBACK TERMINAL' */
/* * */
/* * */

router.get('/options', async (req, res) => {
  const rows = await spreadsheetAPI.getRows('Options', 2);

  const options = {};

  options.firstQuestionTitle = rows[0].firstQuestionTitle;
  options.firstQuestionOptions = [];
  for (const row of rows) {
    if (row.firstQuestionAnswerIcon || row.firstQuestionAnswerLabel || row.firstQuestionAnswerValue) {
      options.firstQuestionOptions.push({
        icon: row.firstQuestionAnswerIcon,
        label: row.firstQuestionAnswerLabel,
        value: row.firstQuestionAnswerValue,
      });
    }
  }

  options.secondQuestionTitle = rows[0].secondQuestionTitle;
  options.secondQuestionOptions = [];
  for (const row of rows) {
    if (row.secondQuestionAnswerIcon || row.secondQuestionAnswerLabel || row.secondQuestionAnswerValue) {
      options.secondQuestionOptions.push({
        icon: row.secondQuestionAnswerIcon,
        label: row.secondQuestionAnswerLabel,
        value: row.secondQuestionAnswerValue,
      });
    }
  }

  res.send(options);
});

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
  await spreadsheetAPI.addNewRow('Responses', feedback);

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
  if (error) return res.status(400).send(error.details[0].message);

  const rows = await spreadsheetAPI.getRows('Responses', 5, true);

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
