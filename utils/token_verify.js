const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function isTokenValid(req, res, next) {
  const token = req.query.secret_token;

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        status: 0,
        message: "unauthorized",
      });
    }
    req.decodedJWT = decoded;
  });

  const user = await User.findById(req.decodedJWT.user._id);
  if (user) {
    next();
  }
}

module.exports = isTokenValid;
