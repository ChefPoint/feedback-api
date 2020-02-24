/* * */
/* * */
/* * * * * */
/* CONFIGURATION */
/* * */

const config = require("config");

module.exports = function() {
  if (!config.get("auth.jwt-private-key")) {
    throw new Error("FATAL ERROR: << auth_jwtPrivateKey >> is not defined.");
  }
};
