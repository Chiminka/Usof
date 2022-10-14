import { Router } from "express";
const router = new Router();
import { CategoryController } from "../controllers/categories.js";
import { checkAuth } from "../utils/checkAuth.js";

const categoryController = new CategoryController();

// Create Category +
// http://localhost:3002/api/categories
router.post("/", checkAuth, categoryController.createCategory);

// Get all +
// http://localhost:3002/api/categories
router.get("/", categoryController.getAll);

// Get by id +
// http://localhost:3002/api/categories/:id
router.get("/:id", categoryController.byId);

// Get Category Posts +
// http://localhost:3002/api/categories/:id/posts
router.get("/:id/posts", categoryController.categoryPosts);

// Update Category +
// http://localhost:3002/api/categories/:id
router.patch("/:id", checkAuth, categoryController.updateCategory);

// Remove Category +
// http://localhost:3002/api/categories/:id
router.delete("/:id", checkAuth, categoryController.removeCategory);

export default router;
