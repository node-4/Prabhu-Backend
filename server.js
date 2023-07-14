const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyparser = require("body-parser");
const serverless = require("serverless-http");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 2006;
mongoose.connect("mongodb+srv://varun:varun123@cluster0.6lqej.mongodb.net/prabhu?retryWrites=true&w=majority").then(() => {
  console.log("Prabhu Db conneted succesfully");
}).catch((err) => {
  console.log(err);
});
app.get("/", (req, res) => {
  res.status(200).send({ msg: "Working App" });
});
require("./route/static.route")(app);
require("./route/instructor")(app);


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = {
  handler: serverless(app),
};