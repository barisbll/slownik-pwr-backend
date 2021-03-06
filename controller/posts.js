const Title = require("../model/titles");
const User = require("../model/users");

const TITLES_FETCHED_LIMIT = 20;

// Gets 20 titles, those titles will be used in side menu version 1
exports.getTitles = async (req, res, next) => {
  try {
    const titlesResult = await Title.find()
      .limit(TITLES_FETCHED_LIMIT)
      .select("titleName");

    res.status(200).json({ output: titlesResult });
  } catch (err) {
    next(err);
  }
};

// Gets 1 title with all the posts and user data inside that title
exports.getTitle = async (req, res, next) => {
  const { titleId } = req.params;

  try {
    const titleResult = await Title.findOne({ _id: titleId })
      .limit(20)
      .populate("posts.userId");

    if (!titleResult) throw new Error("No such a title exists!");

    res.json({ output: titleResult });
  } catch (err) {
    next(err);
  }
};

// Creates a post under an already created title
exports.postCreatePost = async (req, res, next) => {
  const { titleId } = req.params;
  const { userId } = req;
  const { postContent } = req.body;

  const date = new Date().toISOString();

  try {
    const user = await User.findById(userId);

    const titleResult = await Title.findOne({ _id: titleId });

    const post = {
      postContent,
      date,
      userId: user._id,
    };

    titleResult.posts.push(post);

    const updatedTitleResult = await titleResult.save();

    // Finds the lastly created post's id to add to the user
    const createdPostsId =
      updatedTitleResult.posts[updatedTitleResult.posts.length - 1]._id;

    user.posts.push(createdPostsId);

    user.save();

    res.status(201).json({ output: updatedTitleResult });
  } catch (err) {
    next(err);
  }
};

// Create a title and the first post
exports.postCreateTitle = async (req, res, next) => {
  const { titleName } = req.body;
  const { userId } = req;
  const { postContent } = req.body;

  const date = new Date().toISOString();

  try {
    const user = await User.findById(userId);

    const alreadyExistingTitle = await Title.findOne({ titleName });

    if (alreadyExistingTitle) {
      throw new Error("Title already exists!!!");
    }

    const title = new Title({
      titleName,
      posts: [
        {
          postContent,
          date,
          userId: user._id,
        },
      ],
    });

    const titleResult = await title.save();

    // Finds the lastly created post's id to add to the user
    const createdPostsId = titleResult.posts[titleResult.posts.length - 1]._id;

    user.posts.push(createdPostsId);

    user.save();

    res.status(200).json({ output: titleResult });
  } catch (err) {
    next(err);
  }
};

// Finds a post and updates its content
exports.putUpdatePost = async (req, res, next) => {
  const { titleId } = req.body;
  const { postId } = req.body;
  const { userId } = req;
  const { postContent } = req.body;

  try {
    const user = await User.findById(userId);

    const titleResult = await Title.findById(titleId);

    const updatedTitle = await titleResult.updatePost(
      postId,
      postContent,
      user._id
    );

    res.status(201).json({ output: updatedTitle });
  } catch (err) {
    next(err);
  }
};

exports.deleteDeletePost = async (req, res, next) => {
  const { titleId } = req.params;
  const { postId } = req.params;
  const { userId } = req;

  try {
    const user = await User.findById(userId);

    const titleResult = await Title.findById(titleId);

    const updatedTitle = await titleResult.deletePost(postId, user._id, Title);

    user.deletePost(postId);

    res.status(200).json({ output: updatedTitle });
  } catch (err) {
    next(err);
  }
};
