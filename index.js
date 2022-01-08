'use_strict';

/* * */
/* IMPORTS */
const winston = require('winston');
const config = require('config');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/communication')(app);
require('./startup/routes')(app);
require('./startup/production')(app);

const port = process.env.PORT || config.get('connection.port') || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
