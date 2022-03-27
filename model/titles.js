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

module.exports = mongoose.model("Title", titleSchema);
