/* * */
/* * */
/* * * * * */
/* WINSTON ERROR HANDLING */
/* * */

const winston = require("winston");
require("express-async-errors");

module.exports = function() {
  /* Add a new transport with level ["error"] in ["logs/error.log"] */
  winston.add(
    new winston.transports.File({
      format: winston.format.json(),
      filename: "logs/error.log",
      level: "error"
    })
  );

  /* Add a new transport with level ["info"] in ["logs/combined.log"] */
  winston.add(
    new winston.transports.File({
      format: winston.format.json(),
      filename: "logs/combined.log",
      level: "info"
    })
  );

  /* Log to the console if not in "production" */
  // if (process.env.NODE_ENV !== "production") {
  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      colorize: true,
      prettyPrint: true
    })
  );
  // }

  /* Handle Promise Rejections in winston */
  process.on("unhandledRejection", err => {
    throw err;
  });
};
