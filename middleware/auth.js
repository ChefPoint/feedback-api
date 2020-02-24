const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Switch authentication ON or OFF based on config file
  if (config.get("auth.require-auth")) {
    // Token is sent in the request header named x-auth-token
    const token = req.header("x-auth-token");

    // If user is not logged in
    if (!token)
      return res.status(401).send("Access denied. No token provided.");

    // If token was provided check if it is valid
    try {
      req.user = jwt.verify(token, config.get("auth.jwt-private-key"));
      next();
    } catch (err) {
      res.status(400).send("Invalid token.");
    }
  }
  next();
};
