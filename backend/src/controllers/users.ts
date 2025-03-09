import { Request, Response } from 'express';
import { UserService } from '../services/users.js';
import { UserDTO } from '../interfaces/user.js';
import { User } from '../entities/users/user.entity.js';

export async function getAllUsersHandler<T extends User>(
    req: Request,
    res: Response,
    service: UserService<T>
): Promise<void> {
    try {
        const full = req.query.full === 'true';

        const users: UserDTO[] | string[] = full
            ? await service.getAllUsers()
            : await service.getAllUserIds();

        if (!users) {
            res.status(404).json({ error: `Users not found.` });
            return;
        }

        res.status(201).json(users);
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getUserHandler<T extends User>(
    req: Request,
    res: Response,
    service: UserService<T>
): Promise<void> {
    try {
        const username = req.params.username as string;

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const user = await service.getUserByUsername(username);

        if (!user) {
            res.status(404).json({
                error: `User with username '${username}' not found.`,
            });
            return;
        }

        res.status(201).json(user);
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createUserHandler<T extends User>(
    req: Request,
    res: Response,
    service: UserService<T>,
    UserClass: new () => T
) {
    try {
        console.log('req', req);
        const userData = req.body as UserDTO;

        if (!userData.username || !userData.firstName || !userData.lastName) {
            res.status(400).json({
                error: 'Missing required fields: username, firstName, lastName',
            });
            return;
        }

        const newUser = await service.createUser(userData, UserClass);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteUserHandler<T extends User>(
    req: Request,
    res: Response,
    service: UserService<T>
) {
    try {
        const username = req.params.username;

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const deletedUser = await service.deleteUser(username);
        if (!deletedUser) {
            res.status(404).json({
                error: `User with username '${username}' not found.`,
            });
            return;
        }

        res.status(200).json(deletedUser);
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
