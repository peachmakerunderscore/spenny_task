const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DATABASE_CONN_STRING =
  process.env.DATABASE_CONN_STRING ||
  "mongodb+srv://jaibhatt:J0yqRxeKmttcNeK0a@cluster0.syckn.mongodb.net/spennyDatabase?retryWrites=true&w=majority";

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
