import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        time: {
            type: Number,
            required: true,
        },
        free: {
            type: Boolean,
            required: true,
            default: true
        },
        video: {
            type: String,
            required: true,
        },
        course: {
            type: mongoose.Types.ObjectId,
            ref: "Course",
        },
    },
    { timestamps: true }
);

const Session = mongoose.model("Session", SessionSchema);
export default Session;