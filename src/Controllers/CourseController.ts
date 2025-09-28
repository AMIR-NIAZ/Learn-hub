import { Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import { CourseValidator } from "../Validators/CourseValidator";
import Category from "../Models/Category";
import Course from "../Models/Course";
import moment from "moment-jalaali";

export class CourseController {
    static async CreateCourse(req: Request, res: Response) {
        const {
            title,
            description,
            price,
            status,
            time,
            href,
            category
        } = req.body;
        const { avatar } = (req as any).file;
        const categoryExists = await Category.findById(category).lean();
        if (!categoryExists) throw new AppError("Category not found", 404);
        await CourseController.Validation(req);
        const gregorianDate = new Date(); 
        const persianDate = moment(gregorianDate).format("jYYYY/jMM/jDD");
        const course = await Course.create({
            title,
            description,
            price,
            status,
            time,
            lastUpdate: persianDate,
            href,
            category,
            teacher: (req as any).user._id,
            avatar
        });
        return res.status(201).json({ success: true, course });
    }

    private static async Validation(req: Request) {
        const validator = new CourseValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}