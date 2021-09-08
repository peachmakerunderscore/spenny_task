var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

var userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Can't be blank"],
    unique: false,
    minlength: 3,
    trim: true,
    match: [/^[a-zA-Z]+$/, "is invalid"],
    index: true,
  },
  last_name: {
    type: String,
    required: [true, "Can't be blank"],
    unique: false,
    minlength: 3,
    trim: true,
    match: [/^[a-zA-Z]+$/, "is invalid"],
    index: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
    maxlength: 20,
    required: [true, "Can't be blank"],
  },

  provider: {
    type: String,
    required: [true, "Can't be blank"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

// Creating users password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(64).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
};

var User = mongoose.model("users", userSchema);
module.exports = User;
