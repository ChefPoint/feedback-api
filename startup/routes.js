/* * */
/* * */
/* * * * * */
/* API ROUTES */
/* * */

const terminal_router = require("../routes/terminal");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use("/terminal", terminal_router);
  app.use(error);
};
