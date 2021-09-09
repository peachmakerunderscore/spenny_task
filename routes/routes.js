const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

// Public APIs
router.get("/", (req, res) => {
  res.send("Welcome to Twttr");
});
// SignUp API
router.post(
  "/signup",
  body("first_name").isString().trim().notEmpty().isLength({ min: 3 }),
  body("last_name").trim().notEmpty().isLength({ min: 3 }),
  body("email").trim().notEmpty().isEmail(),
  body("password").trim().isLength({ min: 6, max: 20 }),

  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ans = JSON.parse(JSON.stringify(req.body));

    try {
      const email = ans.email.toLowerCase();
      const userExists = await User.findOne({ email: email });

      if (userExists !== null) {
        res.status(406).json({
          status: 0,
          message: "Account Already Exists",
        });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({
        status: 0,
        message: error,
      });
    }
  },
  function (req, res, next) {
    passport.authenticate("signup", { session: false }, async (err, user) => {
      req.login(user, { session: false }, async (error) => {
        if (error) return res.status(200).json(info.message);

        const body = {
          _id: user._id,
          email: user.email,
          provider: user.provider,
        };

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
        // const savedToken = updateUsersAccessToken(user._id, token);

        // if (!savedToken) {
        //   res.status(500).json({
        //     status: 0,
        //     message: "Oh no!! access_token not saved in the database",
        //   });
        //   return;
        // }

        user.password = undefined;
        user.provider = undefined;

        return res.json({
          status: 1,
          message: "Login succesful",
          token: token,
          user,
        });
      });
    })(req, res, next);
  }
);

router.post(
  "/login",
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isLength({ min: 6, max: 20 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }

    JSON.parse(JSON.stringify(req.body));
    passport.authenticate("login", async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error("An error occurred.");

          return res.status(200).json({ status: 0, message: info.message });
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return res.status(200).json(info.message);

          const body = {
            _id: user._id,
            email: user.email.toLowerCase(),
            provider: user.provider,
          };
          const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
          // const savedToken = updateUsersAccessToken(user._id, token);

          // if (!savedToken) {
          //   return res.status(500).json({
          //     status: 0,
          //     message: "access_token not saved in the database",
          //   });
          // }

          user.password = undefined;
          user.provider = undefined;
          user.access_token = undefined;

          return res.json({
            status: 1,
            message: "Login succesfull",
            token: token,
            user,
          });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }
);

module.exports = router;
