import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Class } from '../../entities/classes/class.entity.js';
import { ClassJoinRequest } from '../../entities/classes/class-join-request.entity.js';
import { Student } from '../../entities/users/student.entity.js';

export class ClassJoinRequestRepository extends DwengoEntityRepository<ClassJoinRequest> {
    public findAllRequestsBy(requester: Student): Promise<ClassJoinRequest[]> {
        return this.findAll({ where: { requester: requester } });
    }
    public findAllOpenRequestsTo(clazz: Class): Promise<ClassJoinRequest[]> {
        return this.findAll({ where: { class: clazz } });
    }
    public deleteBy(requester: Student, clazz: Class): Promise<void> {
        return this.deleteWhere({ requester: requester, class: clazz });
    }
}
