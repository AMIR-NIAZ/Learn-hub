import { Types } from 'mongoose';
import { IComment } from '../Interfaces/IComment';
import { BaseDTO } from './BaseDTO';

export class CommentDTO extends BaseDTO<IComment> {
    constructor(public readonly comment: IComment) {
        super(comment);
    }

    toDTO() {
        const { _id,
            body,
            course,
            user,
            isActive,
            score,
            parent,
            date,
            createdAt,
            updatedAt
        } = this.comment;

        return {
            id: _id,
            body,
            course,
            user,
            isActive,
            score,
            parent: parent ?? null,
            date,
            createdAt,
            updatedAt
        };
    }

    static fromComment(comment: IComment) {
        return new CommentDTO(comment).toDTO();
    }

    static fromComments(comments: IComment[]) {
        return comments.map(comment => new CommentDTO(comment).toDTO());
    }
}
