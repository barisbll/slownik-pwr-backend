const express = require("express");

const postController = require("../controller/posts");

const router = express.Router();

router.get("/get-titles", postController.getTitles);

router.get("/get-title/:titleId", postController.getTitle);

router.post("/post-create-post/:titleId", postController.postCreatePost);

router.post("/post-create-title", postController.postCreateTitle);

router.put("/put-update-post", postController.putUpdatePost);

router.delete("/delete-post/:titleId/:postId", postController.deleteDeletePost);

module.exports = router;
