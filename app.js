const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const secret = require("./secret");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/auth");
const errorController = require("./controller/404");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(secret.mongodbSecret)
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

// 404 page to catch invalid requests
app.use(errorController.get404);

// express.js error handling middleware to handle server errors, (has to have 4 parameters)
app.use((error, req, res, next) => {
  if (!error.status) error.status = 500;
  res.status(error.status).json({ error: error.message });
});
