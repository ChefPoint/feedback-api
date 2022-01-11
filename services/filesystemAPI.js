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
  /* * Default Animation
   * This is the animation returned if key is not found.
   */
  const defaultKey = 'nyan-cat';

  /* * Path
   * This is the predefined directory where Lottie JSON documents are stored.
   */
  const path = '../media/animations/';

  /* * Try Catch
   * The buffer data is retrieved and parsed. If no file is found,
   * send the default animation.
   */
  try {
    const rawdata = fs.readFileSync(path + key + '.json');
    return JSON.parse(rawdata);
  } catch (err) {
    const rawdata = fs.readFileSync(path + defaultKey + '.json');
    return JSON.parse(rawdata);
  }
};
