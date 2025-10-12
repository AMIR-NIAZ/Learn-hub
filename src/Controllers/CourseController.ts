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
import path from "path";
import { CommentValidator } from "../Validators/CommentValidator";
import Comment from "../Models/Comment";
import CourseUser from "../Models/CourseUser";
import { CommentDTO} from "../Dto/CommentDTO";

export class CourseController {
    static async CreateCourse(req: Request, res: Response) {
        const {
            title,
            description,
            price,
            status,
            category
        } = req.body;
        const avatar = (req as any).file?.filename;
        if (!avatar) throw new AppError("Avatar is required", 400);
        const categoryExists = await Category.findById(category).lean();
        if (!categoryExists) throw new AppError("Category not found", 404);
        await CourseController.ValidationCourse(req);
        const gregorianDate = new Date();
        const persianDate = moment(gregorianDate).format("jYYYY/jMM/jDD");
        const course = await Course.create({
            title,
            description,
            price,
            status,
            time: 0,
            lastUpdate: persianDate,
            category,
            teacher: (req as any).user._id,
            avatar
        });
        const mainCourse = await Course.findById(course._id).populate("teacher").populate("category")
        if (!mainCourse) {
            throw new AppError("Course not found", 404);
        }
        const DtoCourse = CourseDTO.fromCourse(mainCourse);
        return res.status(201).json({ success: true, course: DtoCourse });
    }

    static async getAllCourse(req: Request, res: Response) {
        const courses = await Course.find({})
            .populate("teacher", "name")
            .populate("category", "title");
        const DtoCourses = CourseDTO.fromCourses(courses);
        res.status(200).json({
            success: true,
            courses: DtoCourses
        });
    }

    static async getCourseById(req: Request, res: Response) {
        const { id } = req.params;
        let isUserRegisterToThisCourse = null;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const mainCourse = await Course.findById(id)
            .populate("teacher")
            .populate("category")
            .populate({
                path: "comments",
                match: { isActive: true },
                populate: { path: "user", select: "name" },
                options: { sort: { createdAt: -1 } }
            })
            .populate("sessions");
        if (!mainCourse) throw new AppError("Course not found", 404);
        const countUser = await CourseUser.countDocuments({ course: mainCourse._id });
        const DtoCourse = CourseDTO.fromCourse(mainCourse);
        if (((req as any).user)) {
            isUserRegisterToThisCourse = !!(await CourseUser.find({
                user: (req as any).user._id,
                course: mainCourse._id
            }));
        } else {
            isUserRegisterToThisCourse = false;
        }
        return res.status(201).json({ success: true, course: DtoCourse, countStudent: countUser, isUserRegisterToThisCourse });
    }

    static async DeleteCourse(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const mainCourse = await Course.findById(id)
        if (!mainCourse) {
            throw new AppError("Course not found", 404);
        }
        const teacherId = mainCourse.teacher._id.toString();
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
            category
        } = req.body;
        await CourseController.ValidationCourse(req)
        const mainCourse = await Course.findById(id);
        console.log(mainCourse);
        if (!mainCourse) {
            throw new AppError("Course not found", 404);
        }
        const teacherId = (mainCourse.teacher as any).toString();
        const userId = (req as any).user._id.toString();
        if ((req as any).user.role !== "ADMIN") {
            if (teacherId !== userId) throw new AppError("Teacher cannot update this course", 403);
        }
        const gregorianDate = new Date();
        const persianDate = moment(gregorianDate).format("jYYYY/jMM/jDD");
        await mainCourse.updateOne({
            title,
            description,
            price,
            status,
            lastUpdate: persianDate,
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
        CourseController.UpdateCourseTime(id!, Math.floor(duration))
        return res.status(201).json({ success: true, session })
    }

    static async DeleteSession(req: Request, res: Response) {
        const { CourseId, SessionId } = req.params;
        if (!isValidObjectId(CourseId) || !isValidObjectId(SessionId)) {
            throw new AppError("id is not true", 422);
        }
        const mainCourse = await Course.findById(CourseId);
        if (!mainCourse) throw new AppError("Course not found", 404);
        if ((req as any).user.role !== "ADMIN") {
            const teacherId = (mainCourse.teacher as any)._id.toString();
            const userId = (req as any).user._id.toString();
            if (teacherId !== userId) {
                throw new AppError("Teacher cannot delete this course", 403);
            }
        }
        const session = await Session.findByIdAndDelete(SessionId).lean();
        if (!session) throw new AppError("Session not found", 404);
        if (session.course?.toString() !== CourseId) throw new AppError("Session does not belong to this course", 400);
        await CourseController.UpdateCourseTime(CourseId!, session.time * -1);
        if (session.video) {
            fs.unlinkSync(path.join(__dirname, "..", "public", "course", "Sessions", session.video));
        }
        return res.status(200).json({
            success: true,
            message: "Session deleted successfully"
        });
    }

    public static async CreateComment(req: Request, res: Response) {
        const { body, score, parent } = req.body;
        const { id } = req.params;
        const gregorianDate = new Date();
        const persianDate = moment(gregorianDate).format("jYYYY/jMM/jDD");
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        if (parent) {
            if (!isValidObjectId(parent)) throw new AppError("parent is not valid", 422);
        }
        const course = await Course.findById(id);
        if (!course) throw new AppError("Course not found", 404);
        CourseController.ValidationComment({ body, score, parent });
        const comment = await Comment.create({
            body,
            score: score || 5,
            course: course._id,
            user: (req as any).user._id,
            parent: parent || null,
            date: persianDate
        });
        let dto = CommentDTO.fromComment(comment);
        res.status(201).json({ success: true, comment: dto});
    }

    private static async UpdateCourseTime(id: string, time: number) {
        return await Course.findByIdAndUpdate(
            id,
            { $inc: { time: time } },
            { new: true }
        );
    }

    public static async GetAllNotActiveComments(req: Request, res: Response) {
        const comments = await Comment.find({ isActive: false })
            .populate("user", "name avatar")
            .populate("course", "title")
            .populate("parent", "body")
            .sort({ createdAt: -1 })
        let dto = CommentDTO.fromComments(comments);
        res.status(200).json({
            success: true,
            count: comments.length,
            comments: dto,
        });
    }

    public static async activeComment(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const comment = await Comment.findById(id);
        if (!comment) throw new AppError("comment not find", 404);
        await comment.updateOne({ isActive: true });
        res.status(200).json({
            success: true,
            message: "Comment is Active",
        });
    }

    public static async deleteComment(req: Request, res: Response) {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw new AppError("id is not true", 422);
        const comment = await Comment.findById(id);
        if (!comment) throw new AppError("comment not find", 404);
        await comment.deleteOne();
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    }

    public static async registerUser(req: Request, res: Response) {
        const isUserRegister = await CourseUser
            .findOne({
                user: (req as any).user._id,
                course: req.params.id,
            }).lean();
        if (isUserRegister) throw new AppError("User already registered in the course", 409);
        await CourseUser.create({
            user: (req as any).user._id,
            course: req.params.id,
            price: req.body.price
        })
        res.status(201).json({
            success: true,
            message: "User register successfully",
        });

    }


    private static async ValidationCourse(req: Request) {
        const validator = new CourseValidator();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }

    private static async ValidationComment(item: any) {
        const validator = new CommentValidator();
        const errors = await validator.validate(item);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}