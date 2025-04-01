import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Class } from '../../entities/classes/class.entity.js';
import { ClassJoinRequest } from '../../entities/classes/class-join-request.entity.js';
import { Student } from '../../entities/users/student.entity.js';

export class ClassJoinRequestRepository extends DwengoEntityRepository<ClassJoinRequest> {
    public async findAllRequestsBy(requester: Student): Promise<ClassJoinRequest[]> {
        return this.findAll({ where: { requester: requester } });
    }
    public async findAllOpenRequestsTo(clazz: Class): Promise<ClassJoinRequest[]> {
        return this.findAll({ where: { class: clazz } });
    }
    public async deleteBy(requester: Student, clazz: Class): Promise<void> {
        return this.deleteWhere({ requester: requester, class: clazz });
    }
}
