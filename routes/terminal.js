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
/* GET method for [/terminal/sessions] */
/* Responds with all distinct store locations present in the database. */
router.get('/locations', async (req, res) => {
  await POSFeedback.distinct('location', (err, obj) => {
    res.send(obj);
  });
});

/* * */
/* * */
/* * * * * */
/* GET method for [/terminal/temporalscales] */
/* Responds with all distinct store locations present in the database. */
router.get('/timescales', async (req, res) => {
  res.send(['Hour', 'Day', 'Week', 'Month']);
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
/* * */
/* * * * * */
/* GET method for [/api/books/:id] */
/* Responds with a specific item from the database */
router.get('/:id', async (req, res) => {
  const item = await POSFeedback.findById(req.params.id);
  if (item) res.send(item);
  else res.status(404).send('No POSFeedback with the given ID was found.');
});

/* * */
/* Export router for [/POSF/] */
module.exports = router;
