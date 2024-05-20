var jwt = require('jsonwebtoken');

function signToken(payload) {
  const token = jwt.sign(payload, process.env.SECRETE_JWT);
  return token;
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRETE_JWT);
}

module.exports = { signToken, verifyToken };
