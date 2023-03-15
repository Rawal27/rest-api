const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

router.post('/', postController.createPost); // Creates new post
router.get('/:postId', postController.getPostById); // Fetches post by postId
router.get('/', postController.getAllPosts); // Fetches all posts
router.put('/:postId', postController.updatePostById); // Updates a post by postId
router.delete('/:postId', postController.deletePostById); // Deletes a post by postId

module.exports = router;
