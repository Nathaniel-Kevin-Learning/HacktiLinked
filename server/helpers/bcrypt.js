const bcrypt = require('bcryptjs');

function encryptPassword(input) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(input, salt);
  return hash;
}

function checkEncrypt(input, hash) {
  return bcrypt.compareSync(input, hash);
}

module.exports = { encryptPassword, checkEncrypt };
