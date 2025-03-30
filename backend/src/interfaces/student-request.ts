import { mapToStudentDTO, StudentDTO } from './student';
import { ClassJoinRequest, ClassJoinRequestStatus } from '../entities/classes/class-join-request.entity';
import { getClassJoinRequestRepository } from '../data/repositories';
import { Student } from '../entities/users/student.entity';
import { Class } from '../entities/classes/class.entity';

export interface StudentRequestDTO {
    requester: StudentDTO;
    class: string;
    status: ClassJoinRequestStatus;
}

export function mapToStudentRequestDTO(request: ClassJoinRequest): StudentRequestDTO {
    return {
        requester: mapToStudentDTO(request.requester),
        class: request.class.classId!,
        status: request.status,
    };
}

export function mapToStudentRequest(student: Student, cls: Class) {
    return getClassJoinRequestRepository().create({
        requester: student,
        class: cls,
        status: ClassJoinRequestStatus.Open,
    });
}
