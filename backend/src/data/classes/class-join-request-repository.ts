import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Class } from '../../entities/classes/class.entity.js';
import { ClassJoinRequest } from '../../entities/classes/class-join-request.entity.js';
import { Student } from '../../entities/users/student.entity.js';
import { ClassStatus } from '@dwengo-1/common/util/class-join-request';

export class ClassJoinRequestRepository extends DwengoEntityRepository<ClassJoinRequest> {
    public async findAllRequestsBy(requester: Student): Promise<ClassJoinRequest[]> {
        return this.findAll({ where: { requester: requester } });
    }
    public async findAllOpenRequestsTo(clazz: Class): Promise<ClassJoinRequest[]> {
        return this.findAll({ where: { class: clazz, status: ClassStatus.Open } }); // TODO check if works like this
    }
    public async findByStudentAndClass(requester: Student, clazz: Class): Promise<ClassJoinRequest | null> {
        return this.findOne({ requester, class: clazz });
    }
    public async deleteBy(requester: Student, clazz: Class): Promise<void> {
        return this.deleteWhere({ requester: requester, class: clazz });
    }
}
