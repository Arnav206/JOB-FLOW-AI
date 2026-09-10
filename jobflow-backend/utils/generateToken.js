// utils/generateToken.js
const jwt = require("jsonwebtoken");

/**
 * Creates a signed JWT for a given user id.
 * The frontend stores this token and sends it back in the
 * Authorization header as: "Bearer <token>"
 */
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = generateToken;
