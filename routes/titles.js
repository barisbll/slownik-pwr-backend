const express = require("express");

const postController = require("../controller/titles");

const router = express.Router();

router.get("/", postController.getTest);

router.post("/new-post", postController.postPost);

module.exports = router;
