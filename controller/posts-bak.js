const Title = require("../model/titles");
const Post = require("../model/posts");
const User = require("../model/users");

exports.getTest = (req, res) => {
  res.status(200).json({ test: "test4", user: req.user });
};

exports.postNewTitle = (req, res) => {
  let titleResult;

  const title = new Title({
    titleName: "bbbbb",
    posts: [],
  });

  title
    .save()
    .then((result) => {
      titleResult = result;

      const post = new Post({
        postContent: "bbbbb",
        date: new Date(),
        userId: req.user._id,
        titleId: titleResult._id,
      });
      post
        .save()
        .then((postSaveResult) => {
          Title.findById(titleResult._id).then((titleFindResult) => {
            // titleFindResult.posts = [
            //   ...(titleFindResult.posts + postSaveResult._id),
            // ];
            console.log(titleFindResult);
            titleFindResult.posts.push(postSaveResult._id);
            titleFindResult.save().then((lastOne) => {
              res.status(200).json({ result: lastOne });
            });
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.populateTable = (req, res) => {
  Title.findById("623c81cef6fb548222201a78")
    .populate("posts")
    .then((result) => {
      console.log(result.posts[0].userId);
      User.findById(result.posts[0].userId).then((userResult) => {
        console.log(userResult);
      });
      res.status(200).json({ output: result });
    })
    .catch((err) => console.log(err));
};
