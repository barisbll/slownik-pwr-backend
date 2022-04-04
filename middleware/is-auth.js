const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  try {
    if (!authHeader) {
      const err = new Error("Not authenticated");
      err.status = 401;
      throw err;
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, "secret");

    if (!decodedToken) {
      const err = new Error("Not authenticated");
      err.status = 401;
      throw err;
    }

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    next(err);
  }
};
