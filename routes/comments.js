import { Router } from "express";
const router = new Router();
import { CommentController } from "../controllers/comments.js";
import { checkAuth } from "../utils/checkAuth.js";

const commentController = new CommentController();

// Get by ID +
// http://localhost:3002/api/comments/:id
router.get("/:id", commentController.byId);

// Get comment likes +
// http://localhost:3002/api/comments/:id/like
router.get("/:id/like", checkAuth, commentController.getCommentLike);

// Create Comment Like +
// http://localhost:3002/api/comments/:id/like
router.post("/:id/like", checkAuth, commentController.createCommentLike);

// Update by id +
// http://localhost:3002/api/comments/:id
router.patch("/:id", checkAuth, commentController.UpdateComment);

// Remove Comment +
// http://localhost:3002/api/comments/:id
router.delete("/:id", checkAuth, commentController.removeComment);

// Remove Comment Like +
// http://localhost:3002/api/comments/:id/like
router.delete("/:id/like", checkAuth, commentController.removeCommentLike);

export default router;
