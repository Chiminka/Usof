import Post from "../models/Post.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

export class CategoryController {
  // Create Category
  async createCategory(req, res) {
    try {
      //только админ
      const user = await User.findById(req.user.id);
      if (user.role === "admin") {
        const { title, description } = req.body;
        const newCategory = new Category({
          title,
          description,
        });
        await newCategory.save();
        res.json(newCategory);
      } else return res.json("You're not an admin");
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get All Categories
  async getAll(req, res) {
    try {
      const categories = await Category.find().sort("-createdAt");

      if (!categories) {
        return res.json({ message: "None categories" });
      }

      res.json({ categories });
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Category By Id
  async byId(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      res.json(category);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Remove Category
  async removeCategory(req, res) {
    try {
      //только админ
      const user = await User.findById(req.user.id);
      if (user.role === "admin") {
        const { post_id } = req.body;
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category)
          return res.json({ message: "That category is not exist" });
        for (let i = 0; i < post_id.length; i++) {
          await Post.findByIdAndUpdate(post_id[i], {
            $pull: { categories: req.params.id },
          });
        }
        res.json({ message: "Category was deleted" });
      } else return res.json("You're not an admin");
    } catch (error) {
      console.log(error);
      res.json({ message: "Something gone wrong" });
    }
  }
  // Update Category
  async updateCategory(req, res) {
    try {
      //только админ
      const user = await User.findById(req.user.id);
      if (user.role === "admin") {
        const { title, description } = req.body;
        const category = await Category.findById(req.params.id);
        if (title) category.title = title;
        if (description) category.description = description;
        await category.save();
        res.json(category);
      } else return res.json("You're not an admin");
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Category Posts
  async categoryPosts(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      const categoryId = category.id;

      const arr = await Post.find({ categories: { _id: categoryId } });
      res.json(arr);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
}
