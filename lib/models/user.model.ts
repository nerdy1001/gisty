import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, required: true},
    username: { type: String, required: true},
    name: { type: String, required: true},
    image: String,
    bio: String,
    gists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gist'
        }
    ],
    onboarded: {
        type: Boolean,
        default: false
    },
    GistGroups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GistGroup'
        }
    ]
})

// mongoose model won't exist at first so it will fall back to creating 
// a user model based on the user schema
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User