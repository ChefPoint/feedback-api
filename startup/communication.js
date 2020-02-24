/* * */
/* * */
/* * * * * */
/* COMMUNICATION MODULES */
/* * */

const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const parser = require("../middleware/parser");

module.exports = function(app) {
  app.use(cors());
  app.options("*", cors());
  app.use(express.json());
  app.use(fileUpload({ parseNested: true }));
  app.use(parser);
};
