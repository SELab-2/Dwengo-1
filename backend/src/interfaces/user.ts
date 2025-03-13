import { User } from '../entities/users/user.entity.js';

export interface UserDTO {
    id?: string;
    username: string;
    firstName: string;
    lastName: string;
    endpoints?: {
        self: string;
        classes: string;
        questions: string;
        invitations: string;
    };
}

export function mapToUserDTO(user: User): UserDTO {
    return {
        id: user.username,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
    };
}

export function mapToUser<T extends User>(userData: UserDTO, userInstance: T): T {
    userInstance.username = userData.username;
    userInstance.firstName = userData.firstName;
    userInstance.lastName = userData.lastName;
    return userInstance;
}
