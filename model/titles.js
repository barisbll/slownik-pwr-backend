const mongoose = require("mongoose");

const { Schema } = mongoose;

const titleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  posts: [
    {
      postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    },
  ],
});

module.exports = mongoose.model("Title", titleSchema);
