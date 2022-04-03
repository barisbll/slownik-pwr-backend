const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      postId: { type: Schema.Types.ObjectId, ref: "Post" },
    },
  ],
});

// Finds a post and deletes it without mutating the original posts array
userSchema.methods.deletePost = function (postId) {
  const postToUpdateIndex = this.posts.findIndex(
    (post) => post._id.toString() === postId.toString()
  );

  if (postToUpdateIndex === -1)
    throw new Error("PostId does not exist under this title");

  const updatedPostsArray = [...this.posts];

  // Delete the post
  updatedPostsArray.splice(postToUpdateIndex, 1);

  this.posts = updatedPostsArray;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
