import mongoose from "mongoose";

const BanSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

const Ban = mongoose.model("Ban", BanSchema)
export default Ban
