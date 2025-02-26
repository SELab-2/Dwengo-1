import { DwengoEntityRepository } from '../dwengo-entity-repository';
import { User } from '../../entities/users/user.entity';

export class UserRepository extends DwengoEntityRepository<User> {
    public findByUsername(username: string): Promise<User | null> {
        return this.findOne({ username: username });
    }
    public deleteByUsername(username: string): Promise<void> {
        return this.deleteWhere({ username: username });
    }
}
