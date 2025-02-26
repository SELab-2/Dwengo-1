import { DwengoEntityRepository } from '../dwengo-entity-repository';
import { Class } from '../../entities/classes/class.entity';
import { ClassJoinRequest } from '../../entities/classes/class-join-request.entity';
import { Student } from '../../entities/users/student.entity';

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
