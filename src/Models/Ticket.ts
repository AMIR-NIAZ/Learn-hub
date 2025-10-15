import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: true
    },
    answer: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamps: true})

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;