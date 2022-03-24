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
  titleId: {
    type: Schema.Types.ObjectId,
    ref: "Title",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
