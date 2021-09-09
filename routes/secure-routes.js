const express = require("express");
const router = express.Router();
const { check, validationResult, body } = require("express-validator");
const isTokenValid = require("../utils/token_verify");
const User = require("../models/user");
const Tweets = require("../models/userTweets");
const Relations = require("../models/relations");

router.get("/home", isTokenValid, async (req, res) => {
  console.log(req.decodedJWT.user._id);
  Tweets.aggregate([
    {
      $lookup: {
        from: "relations",
        let: { userIDinTweet: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user_id", req.decodedJWT.user._id] },
                  { $eq: ["$follows", "$$userIDinTweet"] },
                ],
              },
            },
          },
        ],
        as: "alltweets",
      },
    },
    {
      $sort: {
        tweetedAt: -1,
      },
    },
  ])
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post(
  "/tweet",
  body("tweet").notEmpty().isLength({ max: 140 }),
  isTokenValid,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }
    const tweet = {
      tweet: req.body.tweet,
      user_id: req.decodedJWT.user._id,
      tweetedAt: Date.now(),
    };

    const Tweeter = await Tweets.create(tweet);
    if (Tweeter) {
      return res.status(200).json({
        status: 1,
        message: "Tweet succesful",
      });
    } else {
      return res.status(401).json({
        status: 0,
        message: "Tweet could not be posted",
      });
    }
  }
);

router.post("/follow", isTokenValid, async (req, res) => {
  const email = req.body.email;
  const followee = await User.findOne({ email: email });
  if (followee) {
    const follower = {
      user_id: req.decodedJWT.user._id,
      follows: followee._id,
    };
    const relationSetter = await Relations.create(follower);
    if (relationSetter) {
      return res.status(200).json({
        status: 1,
        message: "Follow succesfull",
      });
    } else {
      return res.status(401).json({
        status: 1,
        message: "Could not follow the person",
      });
    }
  } else {
    return res.status(200).json({
      status: 0,
      message: "User requested was not found",
    });
  }
});

router.get("/peopleifollow", isTokenValid, async (req, res) => {
  const following = await Relations.find({ user_id: req.decodedJWT.user._id });
  if (following) {
    return res.status(200).json({
      status: 1,
      message: following,
    });
  } else {
    return res.status(200).json({
      status: 0,
      message: "Could not get people you follow",
    });
  }
});

router.get("/peoplewhofollowme", isTokenValid, async (req, res) => {
  const following = await Relations.find({ follows: req.decodedJWT.user._id });
  if (following.length == 0) {
    return res.status(200).json({
      status: 1,
      message: `There are ${following.length} people who follow you.`,
    });
  }
  if (following) {
    return res.status(200).json({
      status: 1,
      followers: `There are ${following.length} people who follow you.`,
      message: following,
    });
  } else {
    return res.status(200).json({
      status: 0,
      message: "Could not get people you follow",
    });
  }
});

router.get("/getalltweets", isTokenValid, async (req, res) => {
  const alltweets = await Tweets.find({});
  if (alltweets.length == 0) {
    return res.status(200).json({
      status: 1,
      message: `There are ${following.length} people who follow you.`,
    });
  }
  if (alltweets) {
    return res.status(200).json({
      status: 1,
      message: alltweets,
    });
  } else {
    return res.status(200).json({
      status: 0,
      message: "Could not get people you follow",
    });
  }
});

module.exports = router;
