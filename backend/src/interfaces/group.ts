import { Group } from '../entities/assignments/group.entity.js';
import { AssignmentDTO, mapToAssignmentDTO } from './assignment.js';
import { mapToStudentDTO, StudentDTO } from './student.js';

export interface GroupDTO {
    assignment: number | AssignmentDTO;
    groupNumber: number;
    members: string[] | StudentDTO[];
}

export function mapToGroupDTO(group: Group): GroupDTO {
    return {
        assignment: mapToAssignmentDTO(group.assignment), // ERROR: , group.assignment.within),
        groupNumber: group.groupNumber,
        members: group.members.map(mapToStudentDTO),
    };
}

export function mapToGroupDTOId(group: Group): GroupDTO {
    return {
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber,
        members: group.members.map((member) => {
            return member.username;
        }),
    };
}
