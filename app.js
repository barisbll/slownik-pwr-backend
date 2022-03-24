const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const secret = require("./secret");
const postRoutes = require("./routes/titles");
const User = require("./model/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

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

app.use(postRoutes);

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
