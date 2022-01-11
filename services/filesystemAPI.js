'use strict';

/* * * * * */
/* FILESYSTEM */
/* * */

/* * */
/* IMPORTS */
const fs = require('fs');

/* * */
/* GET ANIMATION */
/* This function retrieves an animation JSON document by it's key */
/* from a predefined directory. It parses and returns the contents. */
exports.getAnimation = async (key) => {
  //
  /* * Path
   * This is the predefined directory where Lottie JSON documents are stored.
   */
  const path = '../media/animations/';

  /* * Get and Parse
   * The buffer data is retrieved and parsed.
   */
  const rawdata = fs.readFileSync(path + key + '.json');
  return JSON.parse(rawdata);
};
