const express = require("express");
const cors = require("cors");
const passport = require("passport");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config.env" });

require("./auth/auth");

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(mongoSanitize());
app.use(xssClean());
app.use(express.json());
app.use(cors());

app.use("/", routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoute);
//
module.exports = app;
