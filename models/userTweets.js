var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

var tweetSchema = mongoose.Schema({
  tweet: {
    type: String,
    required: [true, "Can't be blank"],
    unique: false,
    index: true,
  },
  user_id: {
    type: String,
    required: [true, "Can't be blank"],
    unique: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

var Tweets = mongoose.model("tweets", tweetSchema);
module.exports = Tweets;
