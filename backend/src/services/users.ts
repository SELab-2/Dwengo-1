import { UserRepository } from '../data/users/user-repository.js';
import { UserDTO, mapToUser, mapToUserDTO } from '../interfaces/user.js';
import { User } from '../entities/users/user.entity.js';

export class UserService<T extends User> {
    protected repository: UserRepository<T>;

    constructor(repository: UserRepository<T>) {
        this.repository = repository;
    }

    async getAllUsers(): Promise<UserDTO[]> {
        const users = await this.repository.findAll();
        return users.map(mapToUserDTO);
    }

    async getAllUserIds(): Promise<string[]> {
        const users = await this.getAllUsers();
        return users.map((user) => user.username);
    }

    async getUserByUsername(username: string): Promise<UserDTO | null> {
        const user = await this.repository.findByUsername(username);
        return user ? mapToUserDTO(user) : null;
    }

    async createUser(userData: UserDTO, UserClass: new () => T): Promise<T> {
        const newUser = mapToUser(userData, new UserClass());
        await this.repository.save(newUser);
        return newUser;
    }

    async deleteUser(username: string): Promise<UserDTO | null> {
        const user = await this.getUserByUsername(username);
        if (!user) {
            return null;
        }
        await this.repository.deleteByUsername(username);
        return mapToUserDTO(user);
    }
}
