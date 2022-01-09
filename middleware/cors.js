const config = require('config');

module.exports = function (req, res, next) {
  if (config.get('connection.allow-cross-domain')) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'POST, PUT'); // Content-Type, Origin, X-Requested-With, Accept
  }
  next();
};
