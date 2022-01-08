/* * */
/* * */
/* * * * * */
/* COMMUNICATION MODULES */
/* * */

const cors = require('cors');
const express = require('express');
const parser = require('../middleware/parser');

module.exports = function (app) {
  app.use(cors());
  app.options('*', cors());
  app.use(express.json());
  app.use(parser);
};
