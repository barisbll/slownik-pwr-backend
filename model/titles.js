const mongoose = require("mongoose");

const { Schema } = mongoose;

const titleSchema = new Schema({
  titleName: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("Title", titleSchema);
