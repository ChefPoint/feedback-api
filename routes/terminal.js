/* * */
/* IMPORTS */
const router = require("express").Router();
const { POSFeedback, validate } = require("../models/POSFeedback");

const Moment = require("moment");
const MomentRange = require("moment-range");

const moment = MomentRange.extendMoment(Moment);

/* * */
/* * */
/* * */
/* * * * * */
/* ROUTES FOR 'POINT-OF-SALE FEEDBACK' */
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
router.post("/", async (req, res) => {
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
router.put("/:id", async (req, res) => {
  // Validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Try saving to the database
  const item = await POSFeedback.findByIdAndUpdate(
    req.params.id /* Which item to update */,
    req.body /* What is to change */,
    { new: true } /* Respond with the updated document */
  );

  res.send(item);
});

/* * */
/* * */
/* * * * * */
/* GET method for [/api/books/:id] */
/* Responds with a specific item from the database */
router.get("/:id", async (req, res) => {
  const item = await POSFeedback.findById(req.params.id);
  if (item) res.send(item);
  else res.status(404).send("No POSFeedback with the given ID was found.");
});

/* * */
/* * */
/* * * * * */
/* GET method for [/POSF/locations] */
/* Responds with all distinct store locations present in the database. */
router.get("/locations", async (req, res) => {
  const availableLocations = await POSFeedback.distinct("store");
  res.send(availableLocations);
});

/* * */
/* * */
/* * * * * */
/* GET method for [/POSF/score] */
/* Updates an existing item in the database. */
/* Responds with the updated item */
router.get("/score/:timescale", async (req, res) => {
  // 1 - Timeframe
  // Query the database and get items matching the requested timeframe
  const itemsInRequestedTimeframe = await POSFeedback.find({
    timestamp: {
      $gte: new Date(req.query.startDate),
      $lt: new Date(req.query.endDate)
    }
  });

  // 2 - Location (previously Store)
  // Filter given items that match the requested store location
  const itemsFromRequestedLocation = itemsInRequestedTimeframe.filter(item => {
    // Change .store ->> to ->> .location
    // return item.location === req.query.location;
    return item.store === req.query.location;
  });

  // 3 - Score
  // Filter given items that match the requested score value
  const itemsWithRequestedScore = itemsFromRequestedLocation.filter(item => {
    return item.score === req.query.score;
  });

  // 4 - How many items in each timescale
  // From previously filtered items,
  // count how many are from each day in the given timeframe

  // Initialize final array
  const data = [];

  // Get a timeframe
  const timeframe = moment.range(
    moment(req.query.startDate),
    moment(req.query.endDate)
  );

  // Set timescale (day, hour, minute). Default to day.
  const timescale = req.param.timescale || "day";

  // Count how many items match .timestamp for each day
  for (let timeunit of timeframe.by(timescale)) {
    const itemsFromThisTimeUnit = itemsWithRequestedScore.filter(item => {
      if (
        moment(item.timestamp).isBetween(
          timeunit,
          moment(timeunit).add(1, timescale)
        )
      )
        return item;
    });

    data.push({
      x: timeunit.toISOString(),
      y: itemsFromThisTimeUnit.length
    });
  }

  // Send final data array
  res.send(data);
});

/* * */
/* Export router for [/POSF/] */
module.exports = router;
