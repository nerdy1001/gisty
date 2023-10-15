import mongoose from "mongoose";

const gistSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Groups',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gist'
        }
    ]
})

// mongoose model won't exist at first so it will fall back to creating 
// a gist model based on the gist schema
const Gist = mongoose.models.Gist || mongoose.model('Gist', gistSchema)

export default Gist