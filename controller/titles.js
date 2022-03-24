const Post = require("../model/titles");

exports.getTest = (req, res) => {
  res.status(200).json({ test: "test4", user: req.user });
};

exports.postPost = (req, res) => {
  const post = new Post({
    content: "test",
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Success" });
    })
    .catch((err) => console.log(err));
};
