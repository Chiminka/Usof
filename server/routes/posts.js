import { Router } from "express";
import { PostController } from "../controllers/posts.js";
import { checkAuth } from "../utils/checkAuth.js";
const router = new Router();

const postController = new PostController();

// Create Post +
// http://localhost:3002/api/posts
router.post("/", checkAuth, postController.createPost);

// Get All Posts +
// http://localhost:3002/api/posts
router.get("/", checkAuth, postController.getAll);

// Get Post By Id +
// http://localhost:3002/api/posts/:id
router.get("/:id", postController.getById);

// Update Post +
// http://localhost:3002/api/posts/:id
router.patch("/:id", checkAuth, postController.updatePost);

// Remove Post +
// http://localhost:3002/api/posts/:id
router.delete("/:id", checkAuth, postController.removePost);

// Get Post Comments +
// http://localhost:3002/api/posts/:id/comments
router.get("/:id/comments", postController.getPostComments);

// Create Post Comment +
// http://localhost:3002/api/posts/:id/comments
router.post("/:id/comments", checkAuth, postController.createComment);

// Get Post Categories +
// http://localhost:3002/api/posts/:id/categories
router.get("/:id/categories", postController.getCategory);

// Get Post Likes  +
// http://localhost:3002/api/posts/:id/like
router.get("/:id/like", checkAuth, postController.getLikes);

// Create Post Like +
// http://localhost:3002/api/posts/:id/like
router.post("/:id/like", checkAuth, postController.createLikes);

// Delete Post Like   +
// http://localhost:3002/api/posts/:id/like
router.delete("/:id/like", checkAuth, postController.deleteLikes);

export default router;
