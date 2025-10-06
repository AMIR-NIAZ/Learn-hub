import { ICourse } from "../Interfaces/ICourse";
import { BaseDTO } from "./BaseDTO";
import UserDTO from "./UserDTO";
import CategoryDTO from "./CategoryDTO";
import { IUser } from "../Interfaces/IUser";
import { ICategory } from "../Interfaces/ICategory";
import { ISession } from "../Interfaces/ISession";
import { IComment } from "../Interfaces/IComment";

export class CourseDTO extends BaseDTO<ICourse> {
    public avatar: string;
    public title: string;
    public description: string;
    public price: number;
    public status: string;
    public time: number;
    public lastUpdate: string;
    public href: string;
    public teacher?: UserDTO;
    public category?: CategoryDTO;
    public sessions?: ISession[] | undefined;
    public comments?: IComment[] | undefined;

    constructor(course: ICourse) {
        super(course);
        this.avatar = course.avatar;
        this.title = course.title;
        this.description = course.description;
        this.price = course.price;
        this.status = course.status;
        this.time = course.time;
        this.lastUpdate = course.lastUpdate;
        this.href = course.href;
        this.teacher = UserDTO.fromUser(course.teacher as IUser);
        this.category = CategoryDTO.fromcategory(course.category as ICategory);
        this.sessions = course.sessions;
        this.comments = course.comments;
    }

    static fromCourse(course: ICourse): CourseDTO {
        return new CourseDTO(course);
    }

    static fromCourses(courses: ICourse[]): CourseDTO[] {
        return courses.map((course) => new CourseDTO(course));
    }

    toObject(): object {
        return {
            id: this.id,
            avatar: this.avatar,
            title: this.title,
            description: this.description,
            price: this.price,
            status: this.status,
            time: this.time,
            lastUpdate: this.lastUpdate,
            href: this.href,
            teacher: this.teacher?.toObject(),
            category: this.category?.toObject(),
            sessions: this.sessions,
            comments: this.comments,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }
}

export default CourseDTO;
