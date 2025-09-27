import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        free: {
            type: Number,
            required: true,
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