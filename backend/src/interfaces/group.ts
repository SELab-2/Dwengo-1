import { Group } from '../entities/assignments/group.entity.js';
import { mapToAssignmentDTO } from './assignment.js';
import { mapToStudentDTO } from './student.js';
import { GroupDTO } from 'dwengo-1-common/src/interfaces/group';

export function mapToGroupDTO(group: Group): GroupDTO {
    return {
        assignment: mapToAssignmentDTO(group.assignment), // ERROR: , group.assignment.within),
        groupNumber: group.groupNumber!,
        members: group.members.map(mapToStudentDTO),
    };
}

export function mapToGroupDTOId(group: Group): GroupDTO {
    return {
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
        members: group.members.map((member) => member.username),
    };
}
