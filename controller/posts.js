const Title = require("../model/titles");
const Post = require("../model/posts");
const User = require("../model/users");
const { $where } = require("../model/titles");

const TITLES_FETCHED_LIMIT = 20;

// Gets 20 titles, those titles will be used in side menu version 1
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

// Gets 1 title with all the posts and user data inside that title
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

// Creates a post under an already created title
exports.postCreatePost = (req, res, next) => {
  const { titleId } = req.params;
  const { user } = req;
  const { postContent } = req.body;

  const date = new Date().toISOString();

  const post = new Post({
    postContent,
    date,
    userId: user._id,
    titleId,
  });
  post
    .save()
    .then((postResult) => {
      Title.findById(titleId)
        .then((titleFound) => {
          titleFound.posts.push(postResult._id);
          titleFound
            .save()
            .then((titleUpdated) => {
              res.status(201).json({ output: titleUpdated });
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.postCreateTitle = (req, res, next) => {
  const { titleName } = req.body;
  const { user } = req;
  const { postContent } = req.body;

  const date = new Date().toISOString();

  Title.findOne({ titleName })
    .then((alreadyExistingTitle) => {
      if (alreadyExistingTitle) {
        throw new Error("Title already exists!!!");
      }

      const title = new Title({
        titleName,
        posts: [],
      });

      let titleReturned;

      title
        .save()
        .then((titleResult) => {
          titleReturned = titleResult;

          const post = new Post({
            postContent,
            date,
            userId: user._id,
            titleId: titleResult._id,
          });
          post
            .save()
            .then((postResult) => {
              titleReturned.posts.push(postResult._id);

              titleReturned
                .save()
                .then((titleUpdated) => {
                  res.status(201).json({ output: titleUpdated });
                })
                .catch((err) => {
                  next(err);
                });
            })
            .catch((err) => {
              next(err);
            });
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      err.httpStatusCode = 500;
      return next(err);
    });
};
