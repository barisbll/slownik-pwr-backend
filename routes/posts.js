const express = require("express");

const postController = require("../controller/posts");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/get-titles", postController.getTitles);

router.get("/get-title/:titleId", postController.getTitle);

router.post(
  "/post-create-post/:titleId",
  isAuth,
  postController.postCreatePost
);

router.post("/post-create-title", isAuth, postController.postCreateTitle);

router.put("/put-update-post", isAuth, postController.putUpdatePost);

router.delete(
  "/delete-post/:titleId/:postId",
  isAuth,
  postController.deleteDeletePost
);

module.exports = router;
