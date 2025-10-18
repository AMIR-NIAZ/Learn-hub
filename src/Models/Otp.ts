import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        attempts: {
            type: Number,
            default: 0,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 5000,
        },
    },  
);

const Otp = mongoose.model("Otp", OtpSchema);
export default Otp;