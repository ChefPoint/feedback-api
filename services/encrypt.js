const bcrypt = require("bcrypt");

/* * */
/* Settings for password encryption */
const salt_rounds = 10;

/* * */
/* Method to encrypt password */
async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(salt_rounds);
  return await bcrypt.hash(password, salt);
}

/* * */
/* Method to validate password at login */
async function validatePassword(password, against) {
  return await bcrypt.compare(password, against);
}

exports.encryptPassword = encryptPassword;
exports.validatePassword = validatePassword;
