const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  postContent: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const titleSchema = new Schema({
  titleName: {
    type: String,
    unique: true,
    required: true,
  },
  posts: [postSchema],
});

// Finds a post and update the post content without mutate the original post array
titleSchema.methods.updatePost = function (postId, postContent, userId) {
  const postToUpdateIndex = this.posts.findIndex(
    (post) => post._id.toString() === postId.toString()
  );

  if (postToUpdateIndex === -1)
    throw new Error("PostId does not exist under this title");

  const updatedPostsArray = [...this.posts];

  if (
    updatedPostsArray[postToUpdateIndex].userId.toString() !== userId.toString()
  )
    throw new Error("User can not update other users posts");

  if (updatedPostsArray[postToUpdateIndex].postContent === postContent)
    throw new Error("A user can not update with the same post content");

  // Update the post
  updatedPostsArray[postToUpdateIndex].postContent = postContent;
  updatedPostsArray[postToUpdateIndex].date = new Date().toISOString();

  this.posts = updatedPostsArray;
  return this.save();
};

module.exports = mongoose.model("Title", titleSchema);
