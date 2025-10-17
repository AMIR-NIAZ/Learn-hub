import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "anatomy.atlas15@gmail.com",
        pass: "bsgk sxce lkbx vnvw",
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
        from: 'anatomy.atlas15@gmail.com',
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
