import { Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import { EmailValidator } from "../Validators/EmailValidator";
import Otp from "../Models/Otp";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../Utils/email";
import Ban from "../Models/BanUser";

export class OtpController {
    static async sendCode(req: Request, res: Response) {
        const { email } = req.body;
        await OtpController.Validation(req);
        const isBan = await Ban.exists({ email });
        if (isBan) throw new AppError("user is ban", 403);
        const countEmailLimit = await Otp.countDocuments({ email });
        if (+countEmailLimit > 3) throw new AppError("Too many OTP requests. Please try again later.", 429);
        const otp = await sendOtpEmail(email);
        await Otp.create({
            email,
            code: await bcrypt.hash(otp, 10)
        })
        return res.status(200)
            .json({ success: true, message: "OTP sent successfully" });
    }

    static async verifyOtp(req: Request, res: Response) {
        const { email, code } = req.body;
        const otpDocument = await Otp.findOne({ email })
            .sort({ createdAt: -1 });
        if (!otpDocument) throw new AppError("OTP not found or expired", 400);
        if (otpDocument.attempts > 7) throw new AppError("Too many attempts", 429);
        if (!(await bcrypt.compare(code, otpDocument.code))) {
            otpDocument.attempts++;
            await otpDocument.save();
            throw new AppError("Invalid OTP", 404);
        };
        await otpDocument.updateOne({ verified: true })
        return res.status(200)
            .json({ success: true, message: "OTP verified successfully" });
    }

    private static async Validation(req: Request) {
        const validator = new EmailValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}