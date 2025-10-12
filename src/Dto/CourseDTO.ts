import { ICourse } from "../Interfaces/ICourse";
import { BaseDTO } from "./BaseDTO";
import UserDTO from "./UserDTO";
import CategoryDTO from "./CategoryDTO";
import { IUser } from "../Interfaces/IUser";
import { ICategory } from "../Interfaces/ICategory";
import { ISession } from "../Interfaces/ISession";
import { IComment } from "../Interfaces/IComment";

export class CourseDTO extends BaseDTO<ICourse> {
    constructor(public readonly course: ICourse) {
        super(course);
    }

    toDTO() {
        const {
            _id,
            avatar,
            title,
            description,
            price,
            status,
            time,
            lastUpdate,
            teacher,
            category,
            sessions,
            comments,
            createdAt,
            updatedAt
        } = this.course;

        return {
            id: _id,
            avatar,
            title,
            description,
            price,
            status,
            time,
            lastUpdate,
            teacher: teacher ? UserDTO.fromUser(teacher as IUser) : null,
            category: category ? CategoryDTO.fromCategory(category as ICategory) : null,
            sessions: sessions ?? [],
            comments: comments ?? [],
            createdAt,
            updatedAt
        };
    }

    static fromCourse(course: ICourse) {
        return new CourseDTO(course).toDTO();
    }

    static fromCourses(courses: ICourse[]) {
        return courses.map(course => new CourseDTO(course).toDTO());
    }
}

export default CourseDTO;
