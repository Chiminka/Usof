import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export class CommentController {
  // Get Comment By Id
  async byId(req, res) {
    try {
      const comment = await Comment.findById(req.params.id);
      res.json(comment);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Remove comment
  async removeComment(req, res) {
    try {
      //если коммент юзера
      const userId = req.user._id;
      const comment_user = await Comment.findById(req.params.id);
      if (userId.equals(comment_user.author)) {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.json({ message: "That comment is not exist" });
        // если пост удален, удалить и лайки
        const like = await Like.findOneAndRemove({
          author: req.user.id,
          post_or_comment: "Comment",
          post_or_comment_id: req.params.id,
        });
        res.json({ message: "Comment was deleted" });
      } else return res.json({ message: "That's not your comment" });
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Get Comment Likes
  async getCommentLike(req, res) {
    try {
      const arr = await Like.find({
        post_or_comment_id: { _id: req.params.id },
      });
      res.json(arr);
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Create Comment Likes
  async createCommentLike(req, res) {
    try {
      // если у поля лайки есть такой же коммент и автор, тогда говно
      const isLiked = await Like.findOne({
        post_or_comment_id: { _id: req.params.id },
        author: { _id: req.user.id },
      });

      if (!isLiked) {
        const { type } = req.body;
        const newLike = new Like({
          post_or_comment: "Comment",
          post_or_comment_id: req.params.id,
          type,
          author: req.user.id,
        });

        await newLike.save();
        res.json({ message: "Creating like success" });
      } else res.json({ message: "It already has like or dislike" });
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
  // Update Comment
  async UpdateComment(req, res) {
    try {
      //только юзер свой, админ может менять только на активный/неактивный
      const userId = await User.findById(req.user.id);
      const comment_user = await Comment.findById(req.params.id);
      const uId = userId._id;
      if (uId.equals(comment_user.author)) {
        const { comment } = req.body;
        const com = await Comment.findById(req.params.id);
        com.comment = comment;
        await com.save();
        res.json(com);
      } else if (userId.role === "admin") {
        const { status } = req.body;
        if (!status) return res.json("Admin can change just a status");
        const com = await Comment.findById(req.params.id);
        com.status = status;
        await com.save();
        res.json(com);
      } else return res.json("That's not your comment");
    } catch (error) {
      console.log(error);
      res.json({ message: "Something gone wrong" });
    }
  }
  // Remove Comment Like
  async removeCommentLike(req, res) {
    try {
      const like = await Like.findOneAndRemove({
        author: req.user.id,
        post_or_comment: "Comment",
        post_or_comment_id: req.params.id,
      });
      res.json("like was deleted");
    } catch (error) {
      res.json({ message: "Something gone wrong" });
    }
  }
}
