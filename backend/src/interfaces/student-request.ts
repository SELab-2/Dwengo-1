import { mapToStudentDTO } from './student.js';
import { ClassJoinRequest, ClassJoinRequestStatus } from '../entities/classes/class-join-request.entity.js';
import { getClassJoinRequestRepository } from '../data/repositories.js';
import { Student } from '../entities/users/student.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import { ClassJoinRequestDTO } from 'dwengo-1-common/src/interfaces/class-join-request';

export function mapToStudentRequestDTO(request: ClassJoinRequest): ClassJoinRequestDTO {
    return {
        requester: mapToStudentDTO(request.requester),
        class: request.class.classId!,
        status: request.status,
    };
}

export function mapToStudentRequest(student: Student, cls: Class): ClassJoinRequest {
    return getClassJoinRequestRepository().create({
        requester: student,
        class: cls,
        status: ClassJoinRequestStatus.Open,
    });
}
