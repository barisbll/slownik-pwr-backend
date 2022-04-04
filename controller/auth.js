const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../model/users");

exports.postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors });
    }

    const { username } = req.body;
    const { email } = req.body;
    const { password } = req.body;

    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPw,
    });

    const newUser = await user.save();

    res.status(201).json({ output: newUser });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = (req, res) => {
  // TODO
};
