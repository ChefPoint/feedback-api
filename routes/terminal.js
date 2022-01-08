/* * */
/* IMPORTS */
const router = require('express').Router();
const { POSFeedback, validate } = require('../models/POSFeedback');

const Moment = require('moment');
const MomentRange = require('moment-range');

const _ = require('lodash');

const moment = MomentRange.extendMoment(Moment);

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
  // So it's properties become available
  let item = new POSFeedback();

  // Set model properties to req.body
  // And try saving to the database
  item.set(req.body);
  item = await item.save();

  // Send the created item back to the client
  res.send(item);
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

  // Try saving to the database
  const item = await POSFeedback.findByIdAndUpdate(req.params.id /* Which item to update */, req.body /* What is to change */, { new: true } /* Respond with the updated document */);

  res.send(item);
});

/* * */
/* Export router for [/POSF/] */
module.exports = router;
