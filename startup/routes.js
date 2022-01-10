'use strict';

/* * * * * */
/* ROUTES */
/* * */

/* * */
/* IMPORTS */
const terminal_router = require('../routes/terminal');
const error = require('./error');

/* * */
/* Export functions */
module.exports = function (app) {
  app.use('/', terminal_router);
  app.use(error);
};
