/* * */
/* * */
/* * * * * */
/* API ROUTES */
/* * */

const POSF_router = require("../routes/POSF");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use("/POSF", POSF_router);
  app.use(error);
};
