import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "" },
    description: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);
export default mongoose.model("Category", CategorySchema);
