import { Router } from "express";
const router = new Router();
import { UserController } from "../controllers/users.js";
import { checkAuth } from "../utils/checkAuth.js";
import { AuthController } from "../controllers/auth.js";

const authController = new AuthController();
const userController = new UserController();

// Create User + (admin)
// http://localhost:3002/api/users
router.post("/", checkAuth, userController.createUser);

// Get My Posts +
// http://localhost:3002/api/users/posts
router.get("/posts", checkAuth, userController.getMyPosts);

// Get all +
// http://localhost:3002/api/users
router.get("/", userController.getAll);

// By Id +
// http://localhost:3002/api/users/:id
router.get("/:id", userController.getById);

// Change Avatar + (user only himself, admin everyone)
// http://localhost:3002/api/users/:id/avatar
router.patch("/:id/avatar", checkAuth, userController.changeAvatar);

// Update User + (user only himself, admin everyone)
// http://localhost:3002/api/users/:id
router.patch("/:id", checkAuth, userController.updateUser);

// Remove User + (user only himself, admin everyone)
// http://localhost:3002/api/users/:id
router.delete("/:id", checkAuth, userController.removeUser);

// Verify email +
// http://localhost:3002/api/users/verify/:token
router.get("/verify/:token", authController.verifyEmail);

export default router;
