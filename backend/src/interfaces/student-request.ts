import {mapToStudentDTO, StudentDTO} from "./student";
import {ClassJoinRequest, ClassJoinRequestStatus} from "../entities/classes/class-join-request.entity";

export interface StudentRequestDTO {
    requester: StudentDTO;
    class: string;
    status: ClassJoinRequestStatus
}

export function mapToStudentRequestDTO(request: ClassJoinRequest): StudentRequestDTO {
    return {
        requester: mapToStudentDTO(request.requester),
        class: request.class.classId!,
        status: request.status,
    };
}
