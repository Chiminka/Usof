import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Category from "../models/Category.js";
import * as filter from "../utils/filter.js";

export class PostController {
  // Create Post
  async createPost(req, res) {
    try {
      const { title, text, categories } = req.body;

      // categories = id category

      const id = req.user.id;
      const user = await User.findById(id);
      const userId = user.id;

      if (req.files) {
        let fileName = Date.now().toString() + req.files.image.name;
        const __dirname = dirname(fileURLToPath(import.meta.url));
        req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));

        const newPostWithImage = new Post({
          username: user.username,
          title,
          categories: categories,
          text,
          imgUrl: fileName,
          author: userId,
        });

        await newPostWithImage.save();
        return res.json(newPostWithImage);
      }

      const newPostWithoutImage = new Post({
        username: user.username,
        categories: categories,
        title,
        text,
        imgUrl: "",
        author: userId,
      });
      await newPostWithoutImage.save();
      res.json(newPostWithoutImage);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Create Comment
  async createComment(req, res) {
    try {
      // если пост активный
      const post = await Post.findById(req.params.id);
      if (post.status === "active") {
        //id of the post we get from the rout, id of the user we get from the token
        const { comment } = req.body;
        if (!comment) return res.json({ message: "Comment can not be empty" });
        const newComment = new Comment({
          comment,
          author: req.user.id,
          post: req.params.id,
        });
        await newComment.save();
        res.json(newComment);
      } else
        return res.json({
          message: "Post is inactive, you can not leave a comment here",
        });
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get All Posts
  async getAll(req, res) {
    try {
      const { type } = req.params;
      switch (type) {
        case "sortByLikes": {
          // is status is active
          // sort by number likes
          const posts = await Post.find({ status: "active" }).sort("-likes");
          const popularPosts = await Post.find({ status: "active" })
            .limit(5)
            .sort("-views");
          if (!posts) {
            return res.json({ message: "None posts" });
          }
          return res.json({ posts, popularPosts });
        }
        default: {
          // is status is active
          // sort by date
          const id = req.user.id;
          const user = await User.findById(id);
          if (user.role === "admin") {
            const posts = await Post.find().sort("-createdAt");
            const popularPosts = await Post.find().limit(5).sort("-views");
            if (!posts) {
              return res.json({ message: "None posts" });
            }
            return res.json({ posts, popularPosts });
          }
          const posts = await Post.find({ status: "active" }).sort(
            "-createdAt"
          );
          const popularPosts = await Post.find({ status: "active" })
            .limit(5)
            .sort("-views");
          if (!posts) {
            return res.json({ message: "None posts" });
          }
          return res.json({ posts, popularPosts });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Post By Id
  async getById(req, res) {
    try {
      // если статус активный
      const post = await Post.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 },
      });
      if (post.status === "active") res.json(post);
      else return res.json({ message: "Post is inactive" });
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Remove post
  async removePost(req, res) {
    try {
      //только свои посты
      const userId = req.user._id;
      const post_user = await Post.findById(req.params.id);
      if (userId.equals(post_user.author)) {
        const post = await Post.findByIdAndDelete(req.params.id);
        const comment = await Comment.findOneAndDelete({ post: req.params.id });
        if (!post) return res.json({ message: "That post is not exist" });

        // если пост удален, удалить и лайки
        const like = await Like.findOneAndRemove({
          author: req.user.id,
          post_or_comment: "Post",
          post_or_comment_id: req.params.id,
        });

        res.json({ message: "Post was deleted" });
      } else return res.json({ message: "That's not your post" });
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Update post
  async updatePost(req, res) {
    try {
      const { id, title, text, status, categories } = req.body;

      const post = await Post.findById(id);
      const user = await User.findById(req.user.id);

      const userId = user._id;
      const postUserId = post.author._id;

      if (userId.equals(postUserId)) {
        if (req.files) {
          let fileName = Date.now().toString() + req.files.image.name;
          const __dirname = dirname(fileURLToPath(import.meta.url));
          req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
          post.imgUrl = fileName || "";
        }
        if (title) post.title = title;
        if (text) post.text = text;
        if (categories.length === 0) {
          post.categories = [];
        } else if (categories) post.categories = categories;

        await post.save();

        res.json(post);
      } else if (user.role === "admin") {
        post.status = status;
        if (categories.length === 0) {
          post.categories = null;
        } else if (categories) post.categories = categories;
        await post.save();
        res.json(post);
      } else res.json("it's not your post");
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Post Comments
  async getPostComments(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      const postId = post.id;
      const arr = await Comment.find({
        post: { _id: postId },
        status: "active",
      });

      res.json(arr);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Post Category
  async getCategory(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      const list = await Promise.all(
        post.categories.map((title) => {
          return Category.findById(title);
        })
      );
      res.json(list);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Post Likes
  async getLikes(req, res) {
    try {
      const arr = await Like.find({
        post_or_comment_id: { _id: req.params.id },
      });
      res.json(arr);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Create Post Likes
  async createLikes(req, res) {
    try {
      const { type } = req.body;
      if (type === "like" || type === "dislike") {
        // если у поля лайки есть такой же коммент и автор, тогда говно
        const isLiked = await Like.findOne({
          post_or_comment_id: { _id: req.params.id },
          author: { _id: req.user.id },
        });

        if (!isLiked) {
          const newLike = new Like({
            post_or_comment: "Post",
            post_or_comment_id: req.params.id,
            type,
            author: req.user.id,
          });

          if (type === "like") {
            const post = await Post.findByIdAndUpdate(req.params.id, {
              $inc: { likes: 1 },
            });
            const user = await User.findByIdAndUpdate(post.author._id, {
              $inc: { rating: 1 },
            });
          } else if (type === "dislike") {
            const post = await Post.findById(req.params.id);
            if (post.likes == 0) {
            } else
              await Post.findByIdAndUpdate(req.params.id, {
                $inc: { likes: -1 },
              });
            const user = await User.findByIdAndUpdate(post.author._id);
            if (user.rating == 0) {
            } else
              await User.findByIdAndUpdate(post.author._id, {
                $inc: { rating: -1 },
              });
          }
          await newLike.save();
          res.json({ message: "Creating like or dislike success" });
        } else if (
          ((isLiked.type === "like" && type === "dislike") ||
            (isLiked.type === "dislike" && type === "like")) &&
          isLiked.author._id.equals(req.user._id)
        ) {
          if (type === "dislike") {
            const like = await Like.findOne({
              author: req.user.id,
              post_or_comment_id: req.params.id,
              post_or_comment: "Post",
              type: "like",
            });
            like.type = "dislike";
            await like.save();
            const post = await Post.findByIdAndUpdate(req.params.id, {
              $inc: { likes: -1 },
            });
            const user = await User.findByIdAndUpdate(post.author._id, {
              $inc: { rating: -1 },
            });
          } else if (type === "like") {
            const like = await Like.findOne({
              author: req.user.id,
              post_or_comment_id: req.params.id,
              post_or_comment: "Post",
              type: "dislike",
            });
            like.type = "like";
            await like.save();
            const post = await Post.findByIdAndUpdate(req.params.id, {
              $inc: { likes: 1 },
            });
            const user = await User.findByIdAndUpdate(post.author._id, {
              $inc: { rating: 1 },
            });
          }
          res.json({ message: "Creating like or dislike success" });
        } else res.json({ message: "It already has like or dislike" });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "Something gone wrong" });
    }
  }
  // Delete Post Likes
  async deleteLikes(req, res) {
    try {
      const like = await Like.findOneAndRemove({
        author: req.user.id,
        post_or_comment: "Post",
        post_or_comment_id: req.params.id,
      });
      const post = await Post.findByIdAndUpdate(req.params.id, {
        $inc: { likes: -1 },
      });
      const user = await User.findByIdAndUpdate(post.author._id, {
        $inc: { rating: -1 },
      });
      res.json("like was deleted");
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
}
