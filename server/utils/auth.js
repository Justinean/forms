const jwt = require('jsonwebtoken');
require('dotenv').config();

// Sets token secret and expiration date.
const secret = process.env.SECRET;
const expiration = '2h';

module.exports = {
  // Function for our user authentication.
  authMiddleware: function (req, res, next) {
    // Allows token to be sent via  req.body, req.query or req.headers.
    let token = req.body?.token || req.query?.token;
    if (req.headers?.authorization) {
      token = req.headers.authorization.split(' ').pop().trim();
    }

    if (!token) {
      next();
    }

    // Verifies the token and gets user data out of it.
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.log(err);
    }

    // Returns the request object, so it can be passed to the resolver as `context`.
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};