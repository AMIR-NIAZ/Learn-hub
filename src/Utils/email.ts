import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import { ITicket } from "../Interfaces/ITicket";
import dotenv from "dotenv";

dotenv.config()
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.Email,
        pass: process.env.Password_Email,
    },
});

const generateOTP = (length = 5) => {
    return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export const sendOtpEmail = async (email: string) => {
    const otp = generateOTP(5);
    console.log(otp);
    const htmlFilePath = path.join(__dirname, "..", "public", "email", "email.html");
    let fileHtml = fs.readFileSync(htmlFilePath, "utf-8")
    fileHtml = fileHtml
        .replace("{{otp}}", otp);
    const mailOptions = {
        from: process.env.Email,
        to: email,
        subject: "Your OTP Code 🔐",
        html: fileHtml,
    };
    await transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err);
        }
    });
    return otp;
}

export const sendReplyTicketEmail = async (body: string, ticket: ITicket) => {
    const year = new Date().getFullYear();
    const htmlFilePath = path.join(__dirname, "..", "public", "email", "replyTicket.html");
    let fileHtml = fs.readFileSync(htmlFilePath, "utf-8")
    fileHtml = fileHtml
        .replace("{{userName}}", ticket.user.name)
        .replace("{{ticketSubject}}", ticket.title)
        .replace("{{ticketId}}", ticket._id)
        .replace("{{ticketCreatedAt}}", `${ticket.createdAt}`)
        .replace("{{replyMessage}}", body)
        .replace("{{year}}", `${year}`)

    const mailOptions = {
        from: process.env.Email,
        to: ticket.user.email,
        subject: "Reply Your Ticket",
        html: fileHtml,
    };
    await transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(err);
        }
    });
    return true;
}
