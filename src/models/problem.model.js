import mongoose, { Schema } from "mongoose";
const problemSchema = new Schema(
    {
        image: {
            type: String, // cloudinary url,
        },

        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        tags: [String],
        createdAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['open', 'in progress', 'resolved'],
            default: 'open'
        }
    }
)
export const Problem = mongoose.model("Problem", problemSchema)