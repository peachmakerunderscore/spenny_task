var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//
var tweetSchema = mongoose.Schema({
  tweet: {
    type: String,
    maxLength: [140, "You can not write more than 140 characters"],
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
  tweetedAt: {
    type: Date,
  },
});

var Tweets = mongoose.model("tweets", tweetSchema);
module.exports = Tweets;
