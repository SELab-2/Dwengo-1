import { User } from '../entities/users/user.entity.js';
import { UserDTO } from '@dwengo-1/common/interfaces/user';

export function mapToUserDTO(user: User): UserDTO {
    return {
        id: user.username,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
    };
}

export function mapToUsername(user: {username: string}): string {
    return user.username;
}

export function mapToUser<T extends User>(userData: UserDTO, userInstance: T): T {
    userInstance.username = userData.username;
    userInstance.firstName = userData.firstName;
    userInstance.lastName = userData.lastName;
    return userInstance;
}
