import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true,},
        full_name: {type: String},
        password: {type: String, required: true,},
        avatar: { type: String, default: '' },
        rating: { type: Number, default: 0 },
        role: {type: String, required: true, default: 'user'},
        verified: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    { timestamps: true },
)

export default mongoose.model('User', UserSchema)
