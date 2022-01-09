'use strict';

/* * * * * */
/* NETWORK */
/* * */

/* * */
/* IMPORTS */
const cors = require('cors');
const express = require('express');

module.exports = function (app) {
  app.use(cors());
  app.options('*', cors());
  app.use(express.json());
};
