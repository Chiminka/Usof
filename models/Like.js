import mongoose from 'mongoose'

const LikeSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        post_or_comment: { type: String, required: true},
        post_or_comment_id: { type: mongoose.Schema.Types.ObjectId, required: true},
        type: {type: String, default: ''},
    },
    { timestamps: true }
)
export default mongoose.model('Like', LikeSchema)
