import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
    id: { type: String, required: true},
    username: { type: String, required: true},
    name: { type: String, required: true},
    image: String,
    bio: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gist'
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

// mongoose model won't exist at first so it will fall back to creating 
// a user model based on the user schema
const Community = mongoose.models.GistGroup || mongoose.model('Community', CommunitySchema)

export default Community