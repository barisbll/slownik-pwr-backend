const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
