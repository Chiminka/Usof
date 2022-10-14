import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    imgUrl: { type: String, default: "" },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    status: { type: String, default: "active" },
    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Post", PostSchema);
