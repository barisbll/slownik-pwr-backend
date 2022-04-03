const express = require("express");
const { body } = require("express-validator");

const User = require("../model/users");

const userController = require("../controller/users");

const router = express.Router();

router.post(
  "/post-signup",
  [
    // Username validators
    body("username")
      .isAlphanumeric()
      .withMessage("The username can only contains numbers and characters")
      .isLength({ min: 3, max: 15 })
      .withMessage("The username's length must be between 3 - 15 characters"),

    // Email validators
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage(
        "Please enter a valid email under either 'student.pwr.edu.pl' or 'pwr.edu.pl' domains"
      )
      .custom((value) =>
        User.findOne({ email: value }).then((result) => {
          if (result) {
            return Promise.reject(
              new Error(
                "There is a user with that email, please pick another one"
              )
            );
          }
          return true;
        })
      )
      .custom((value) => {
        if (
          value.split("@").at(-1) !== "student.pwr.edu.pl" &&
          value.split("@").at(-1) !== "pwr.edu.pl"
        ) {
          return Promise.reject(
            new Error(
              "Email must be registered under either 'student.pwr.edu.pl' or 'pwr.edu.pl' domains "
            )
          );
        }
        return true;
      }),

    // Password validators
    body("password", "Password must be between 5 - 40 characters").isLength({
      min: 5,
      max: 40,
    }),

    // Confirm password validators
    body("confirmPassword")
      .equals("password")
      .withMessage("Confirm password must be equal to the password"),
  ],
  userController.postSignup
);

module.exports = router;
