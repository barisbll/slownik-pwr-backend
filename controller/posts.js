const Post = require("../model/posts");

exports.getTest = (req, res) => {
  res.status(200).json({ test: "test3" });
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
