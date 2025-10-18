import { Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import { TicketValidator } from "../Validators/TicketValidator";
import Ticket from "../Models/Ticket";
import { isValidObjectId } from "mongoose";
import { sendReplyTicketEmail } from "../Utils/email";
import { ITicket } from "../Interfaces/ITicket";

export class TicketController {
    public static async Create(req: Request, res: Response) {
        const { title, body } = req.body;
        await TicketController.Validation(req)
        const user = (req as any).user;
        const ticket = await Ticket.create({
            title,
            body,
            user
        })
        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
        });
    }

    public static async getAll(req: Request, res: Response) {
        const tickets = await Ticket.find({})
            .populate("user", "email name");
        return res.status(200).json(tickets)
    }

    public static async getUserTickets(req: Request, res: Response) {
        const userId = (req as any).user._id;
        const tickets = await Ticket.find({ user: userId });
        res.status(200).json(tickets);
    }

    public static async getUnrepliedTickets(req: Request, res: Response) {
        const tickets = await Ticket.find({ answer: false })
            .populate("user", "email name");
        return res.status(200).json(tickets)
    }

    public static async deleteTicket(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not valid", 422);
        await Ticket.deleteOne({ _id: id })
        return res.status(200).json("Ticket deleted successfull");
    }

    public static async addTicketReply(req: Request, res: Response) {
        const { body } = req.body;
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not valid", 422);
        if (!body || body.length < 10) throw new AppError("Reply must be at least 10 characters", 422);
        const ticket = await Ticket.findById(id)
            .populate("user")
            .lean<ITicket>();
        if (!ticket) throw new AppError("ticket not find", 404);
        await sendReplyTicketEmail(body, ticket);
        await Ticket.updateOne({ _id: id }, { answer: true });
        res.status(200).json({ success: true, message: "Reply sent successfully" });
    }

    private static async Validation(req: Request) {
        const validator = new TicketValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}