var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

var relationSchema = mongoose.Schema({
  user_id: {
    type: String,
    unique: false,
    index: true,
  },
  follows: {
    type: String,
    index: true,
  },
});

var Relations = mongoose.model("relations", relationSchema);
module.exports = Relations;
