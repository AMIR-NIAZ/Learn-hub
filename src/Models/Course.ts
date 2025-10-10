import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    avatar: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    lastUpdate: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}, { timestamps: true });
CourseSchema.set("toObject", { virtuals: true });
CourseSchema.set("toJSON", { virtuals: true });

CourseSchema.virtual("sessions", {
    ref: "Session",
    localField: "_id",
    foreignField: "course"
});

CourseSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "course"
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;