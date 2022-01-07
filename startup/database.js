/* * */
/* * */
/* * * * * */
/* CONNECTION TO MONGODB */
/* * */

const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
  const connectionString = config.get('database.connection-string');
  mongoose
    // .set()
    .connect(connectionString)
    .then(() => winston.info('Connected to MongoDB...'));

  mongoose.pluralize(null);
};
