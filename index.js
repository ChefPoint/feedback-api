'use strict';

/* * * * * */
/* CHEF POINT FEEDBACK API */
/* START */
/* * */

/* * */
/* IMPORTS */
const config = require('config');
const express = require('express');

/* * */
/* THE EXPRESS APP */
/* Initiate a new instance of Express. */
const app = express();

/* * */
/* MIDDLEWARE */
/* Pass along the required middleware. The order in which */
/* packages are called is not random: first the Networking modules, */
/* then the Routes and finally Production specific modules. */
require('./startup/network')(app);
require('./startup/routes')(app);
require('./startup/production')(app);

/* * */
/* CONNECTION PORT */
/* Get the port from the environment variable in production, */
/* or from settings, or default to 3000. */
const port = process.env.PORT || config.get('connection.port') || 3000;

/* * */
/* START LISTENING */
/* Start listening for requests in the specified port. */
app.listen(port, () => console.log(`Listening on port ${port}...`));
