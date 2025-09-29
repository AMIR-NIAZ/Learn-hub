import { Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import { CourseValidator } from "../Validators/CourseValidator";
import Category from "../Models/Category";
import Course from "../Models/Course";
import moment from "moment-jalaali";
import CourseDTO from "../Dto/CourseDTO";
import { isValidObjectId } from "mongoose";
import fs from "fs";
import getVideoDurationInSeconds from "get-video-duration";
import Session from "../Models/Session";

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
        if (!avatar) throw new AppError("Avatar is required", 400);
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
        const mainCourse = await Course.findById(id)
            .populate("teacher")
            .populate("category")
            .populate("sessions");
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
        if ((req as any).user.role !== "ADMIN") {
            if (teacherId !== userId) throw new AppError("Teacher cannot delete this course", 403);
        }
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
        if ((req as any).user.role !== "ADMIN") {
            if (teacherId !== userId) throw new AppError("Teacher cannot delete this course", 403);
        }
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

    static async CreateSession(req: Request, res: Response) {
        const {
            title,
            free,
        } = req.body;
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const isCourse = await Course.exists({ _id: id });
        if (!isCourse) throw new AppError("Course not find", 404);
        const video = (req as any).file.filename;
        if (!video) throw new AppError("Video is required", 400);
        const filePath = (req as any).file.path;
        const duration = await getVideoDurationInSeconds(
            fs.createReadStream(filePath)
        );
        const session = await Session.create({
            title,
            free,
            course: id,
            video,
            time: Math.floor(duration)
        })
        return res.status(201).json({ success: true, session })
    }

    private static async Validation(req: Request) {
        const validator = new CourseValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}