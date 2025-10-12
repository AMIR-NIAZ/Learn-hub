import { IUser } from '../Interfaces/IUser';
import { BaseDTO } from './BaseDTO';

export class UserDTO extends BaseDTO<IUser> {
    constructor(public readonly user: IUser) {
        super(user);
    }

    toDTO() {
        const { _id, name, email, role, createdAt, updatedAt } = this.user;

        return {
            id: _id,
            name,
            email,
            role,
            createdAt,
            updatedAt
        };
    }

    static fromUser(user: IUser) {
        return new UserDTO(user).toDTO();
    }

    static fromUsers(users: IUser[]) {
        return users.map(user => new UserDTO(user).toDTO());
    }
}

export default UserDTO;
