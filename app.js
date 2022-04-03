const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const secret = require("./secret");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const errorController = require("./controller/404");
const User = require("./model/users");

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

app.use((req, res, next) => {
  User.findOne()
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Routes
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(secret.mongodbSecret)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          username: "Baris",
          email: "baris@test.com",
          password: "password",
          posts: [],
        });
        newUser.save();
      }
    });

    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

// 404 page to catch invalid requests
app.use(errorController.get404);

// express.js error handling middleware to handle server errors
app.use((error, req, res) => {
  console.log(error);
  if (!error.httpStatusCode) error.httpStatusCode = 500;
  res.status(error.httpStatusCode).json({ error: error.message });
});
