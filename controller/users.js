const { validationResult } = require("express-validator");

exports.postSignup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());

    res.status(422).json({ errors });
  }

  res.status("200").json({ ok: 1 });
};
