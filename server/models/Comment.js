import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        status: {type: String, default: "active"}
    },
    { timestamps: true },
)
export default mongoose.model('Comment', CommentSchema)
