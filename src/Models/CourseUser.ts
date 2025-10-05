import mongoose from "mongoose";

const CourseUserSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        course: {
            type: mongoose.Types.ObjectId,
            ref: "Course",
        },
        price: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const CourseUser = mongoose.model("CourseUser", CourseUserSchema);
export default CourseUser;