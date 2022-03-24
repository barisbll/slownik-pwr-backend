const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const secret = require("./secret");
const postRoutes = require("./routes/posts");
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
  User.findById("623c1bf32d49a1c0f07ff89f")
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Post routes
app.use("/posts", postRoutes);

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
