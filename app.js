const express = require("express");
const mongoose = require("mongoose");

const secret = require("./secret");
const postRoutes = require("./routes/posts");

const app = express();

app.use(postRoutes);

mongoose
  .connect(secret.mongodbSecret)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
