const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { DB } = require("./config/config");
const app = require("./app");

const DATABASE_CONN_STRING = process.MONGO_URI || DB;
if (!DATABASE_CONN_STRING) {
  return console.log("Please insert MONGODB URI in enviroment");
}
mongoose
  .connect(DATABASE_CONN_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("\nDatabase connection failed\n");
  });
//
var PORT = process.env.PORT || 9098;
// hello
app.listen(PORT, () => {
  console.log(`server starting on a certain port + ${PORT}`);
});
