const Title = require("../model/titles");
const Post = require("../model/posts");
const User = require("../model/users");

const TITLES_FETCHED_LIMIT = 20;

exports.getTitles = (req, res) => {
  Title.find()
    .limit(TITLES_FETCHED_LIMIT)
    .then((titlesResult) => {
      console.log(titlesResult);
      res.status(200).json({ output: titlesResult });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getTitle = (req, res) => {
  const { titleId } = req.params;

  let titleName;
  const posts = [];

  Title.findById(titleId)
    .populate("posts")
    .then((titleResult) => {
      console.log(titleResult);
      titleName = titleResult.titleName;

      titleResult.posts.forEach((post, idx) => {
        // Add post data to the array item
        posts.push({ postContent: post.postContent, date: post.date });

        User.findById(post.userId)
          .then((userResult) => {
            // Add username to the array item
            posts[idx].username = userResult.username;

            if (idx + 1 === titleResult.posts.length) {
              res.status(200).json({ output: { title: titleName, posts } });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => console.log(err));
};

exports.postCreatePost = (req, res) => {
  const { titleId } = req.params;
  const { user } = req;
  const { postContent } = req.body;
  const { date } = req.body;

  const post = new Post({
    postContent,
    date,
    userId: user._id,
    titleId,
  });
  post
    .save()
    .then((postResult) => {
      res.json({ output: postResult });
    })
    .catch((err) => console.log(err));
};
