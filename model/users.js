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

module.exports = mongoose.model("User", userSchema);
