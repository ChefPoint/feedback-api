'use strict';

/* * * * * */
/* TERMINAL */
/* * */

/* * */
/* IMPORTS */
const router = require('express').Router();
const moment = require('moment');
const Feedback = require('../models/Feedback');
const spreadsheetAPI = require('../services/spreadsheetAPI');

/* * */
/* GET OPTIONS */
/* This function retrieves the options from the spreadsheet, */
/* formats it into JSON and sends it back to the frontend. */
router.get('/options', async (req, res) => {
  //
  /* * getRows(:sheetTitle, :offset): function
   * Retrieve the relevant rows from the spreadsheet,
   * excluding the first three (the first is automatically exluded
   * because it is the header, the other two are headers in the document
   * but the API does not classifies them as such), therefore include
   * an offset of 2 in the function call.
   */
  const rows = await spreadsheetAPI.getRows('Options', 2);

  /* * Options: building the object
   * The object is composed of the first and second questions.
   * For both, we get the title directly from the first row [0].
   * For the answer options (each composed of icon, label and value),
   * we must iterate over all the returned rows and check if each
   * has any of the three values set, because we don't know how many
   * there are or if one obly has icon or label.
   */
  const options = {};

  options.firstQuestionTitle = rows[0].firstQuestionTitle;
  options.firstQuestionOptions = [];
  for (const row of rows) {
    if (row.firstQuestionAnswerIcon || row.firstQuestionAnswerLabel || row.firstQuestionAnswerValue) {
      options.firstQuestionOptions.push({
        icon: row.firstQuestionAnswerIcon,
        label: row.firstQuestionAnswerLabel,
        value: row.firstQuestionAnswerValue,
        // Additional flag to check whether there are follow up questions or not
        followup: row.firstQuestionShouldFollowUp,
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

  /* * Send the Response
   * Finally send the formatted JSON to the client.
   */
  res.send(options);
});

/* * */
/* POST FEEDBACK */
/* This function receives an Feedback item from the client */
/* and validates it according to the JOI object. It then adds */
/* and ID and a timestamp, while reformating the object to be */
/* appended to the spreadsheet. */
router.post('/', async (req, res) => {
  //
  /* * Validation
   * Try to validate the received feedback and pass any errors to the client.
   */
  const { error } = Feedback.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /* * Feedback: build the object
   * Reformat the object while including additional properties:
   * — an ID for later reference, in case the feedback is updated
   * with further answers;
   * - a timestamp, split in date and time formatted as
   * a Google Sheets formula.
   */
  const feedback = {
    id: Date.now().toString(),
    date: moment().format('[=DATE(]YYYY[,]MM[,]DD[)]'),
    time: moment().format('[=TIME(]HH[,]mm[,0)]'),
    location: req.body.location,
    firstQuestionTitle: req.body.firstQuestionTitle,
    firstQuestionAnswerIcon: req.body.firstQuestionAnswerIcon,
    firstQuestionAnswerLabel: req.body.firstQuestionAnswerLabel,
    firstQuestionAnswerValue: req.body.firstQuestionAnswerValue,
  };

  /* * addNewRow(:sheetTitle, :object): function
   * Append the object to the correct worksheet.
   */
  await spreadsheetAPI.addNewRow('Responses', feedback);

  /* * Send the Response
   * Finally send the formated Feedback to the client.
   */
  res.send(feedback);
});

/* * */
/* PUT FEEDBACK */
/* This function is called by the frontend when the original Feedback */
/* response is expanded. The last 5 rows are retrieved from the spreadsheet */
/* and the ID of each compared with the provided ID from the call. */
/* The row is directly expanded with the properties from the received object, */
/* changes saved and sent back to the client. */
router.put('/:id', async (req, res) => {
  //
  /* * Validation
   * Try to validate the received feedback and pass any errors to the client.
   */
  const { error } = Feedback.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  /* * getRows(:sheetTitle, :offset, :startFromEnd): function
   * Retrieve the last 5 rows from the spreadsheet, starting from the end.
   * This dramatically improves speed because we do not iterate over
   * the possible thousands of rows present at any given moment, as the
   * frontend only gives a narrow window for expanding the original feedback.
   */
  const rows = await spreadsheetAPI.getRows('Responses', 5, true);

  for (const row of rows) {
    if (row.id == req.params.id) {
      row.secondQuestionTitle = req.body.secondQuestionTitle;
      row.secondQuestionAnswerIcon = req.body.secondQuestionAnswerIcon;
      row.secondQuestionAnswerLabel = req.body.secondQuestionAnswerLabel;
      row.secondQuestionAnswerValue = req.body.secondQuestionAnswerValue;
      row.save();
      break;
    }
  }

  /* * Send 200
   * Finally inform the client that the Feedback was received and saved.
   */
  res.status(200).send();
});

/* * */
/* Export router */
module.exports = router;
