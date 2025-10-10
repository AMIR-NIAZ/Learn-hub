import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    score: {
        type: Number,
        default: 5,
        max: 5,
        min: 0
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }
}, { timestamps: true })

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;