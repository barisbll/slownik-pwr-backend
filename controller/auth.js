const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/users");

exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors });
  }

  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  try {
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

exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors });
  }

  const { email } = req.body;
  const { password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      const err = new Error("A user with that mail does not exist");
      err.status = 401;
      throw err;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const err = new Error("Wrong email or password");
      err.status = 401;
      throw err;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "secret",
      { expiresIn: "48h" }
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    next(err);
  }
};
