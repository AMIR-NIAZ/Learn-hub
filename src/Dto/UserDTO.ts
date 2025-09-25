import { IUser } from '../Interfaces/IUser';
import { BaseDTO } from './BaseDTO';

export class UserDTO extends BaseDTO<IUser> {
    public name: string;
    public email: string;
    public role: string;

    constructor(user: IUser) {
        super(user);
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
    }

    static fromUser(user: IUser): UserDTO {
        return new UserDTO(user);
    }

    static fromUsers(users: IUser[]): UserDTO[] {
        return users.map(user => new UserDTO(user));
    }

    toObject(): object {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    toJSON(): string {
        return JSON.stringify(this.toObject());
    }
}

export default UserDTO;