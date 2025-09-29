import { Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import { CourseValidator } from "../Validators/CourseValidator";
import Category from "../Models/Category";
import Course from "../Models/Course";
import moment from "moment-jalaali";
import CourseDTO from "../Dto/CourseDTO";
import { isValidObjectId } from "mongoose";

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
        const avatar = (req as any).file.filename;
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
        const mainCourse = await Course.findById(course._id).populate("teacher").populate("category")
        if (!mainCourse) {
            throw new AppError("Course not found", 404);
        }
        const DtoCourse = CourseDTO.fromCourse(mainCourse);
        return res.status(201).json({ success: true, course: DtoCourse.toObject() });
    }

    static async getAllCourse(req: Request, res: Response) {
        const courses = await Course.find({}).populate("teacher", "name");
        const DtoCourses = CourseDTO.fromCourses(courses);
        res.status(200).json({
            success: true,
            courses: DtoCourses.map(course => course.toObject())
        });
    }

    static async getCourseById(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const mainCourse = await Course.findById(id).populate("teacher").populate("category")
        if (!mainCourse) {
            throw new AppError("Course not found", 404);
        }
        const DtoCourse = CourseDTO.fromCourse(mainCourse);
        return res.status(201).json({ success: true, course: DtoCourse.toObject() });
    }

    static async DeleteCourse(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const mainCourse = await Course.findById(id)
        if (!mainCourse) {
            throw new AppError("Course not found", 404);
        }
        const teacherId = (mainCourse.teacher as any)._id.toString();
        const userId = (req as any).user._id.toString();
        if (teacherId !== userId) throw new AppError("Teacher cannot delete this course", 403);
        await mainCourse.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    }

    static async UpdateCourse(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const {
            title,
            description,
            price,
            status,
            time,
            href,
            category
        } = req.body;
        await CourseController.Validation(req)
        const mainCourse = await Course.findById(id);
        console.log(mainCourse);
        if (!mainCourse) {
            throw new AppError("Course not found", 404);
        }
        const teacherId = (mainCourse.teacher as any).toString();
        const userId = (req as any).user._id.toString();
        if (teacherId !== userId) throw new AppError("Teacher cannot delete this course", 403);
        await mainCourse.updateOne({
            title,
            description,
            price,
            status,
            time,
            href,
            category
        })
        return res.status(200).json({
            success: true,
            message: "Course updated successfully"
        });
    }

    private static async Validation(req: Request) {
        const validator = new CourseValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}