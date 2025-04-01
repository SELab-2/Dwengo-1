import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { User } from '../../entities/users/user.entity.js';

export class UserRepository<T extends User> extends DwengoEntityRepository<T> {
    public async findByUsername(username: string): Promise<T | null> {
        return this.findOne({ username } as Partial<T>);
    }
    public async deleteByUsername(username: string): Promise<void> {
        return this.deleteWhere({ username } as Partial<T>);
    }
}
