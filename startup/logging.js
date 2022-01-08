'use_strict';

/* * */
/* * */
/* * * * * */
/* WINSTON ERROR HANDLING */
/* * */

const winston = require('winston');

module.exports = function () {
  winston.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      colorize: true,
      prettyPrint: true,
    })
  );

  /* Handle Promise Rejections in winston */
  process.on('unhandledRejection', (err) => {
    throw err;
  });
};
