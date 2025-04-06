import { Group } from '../entities/assignments/group.entity.js';
import { mapToAssignmentDTO } from './assignment.js';
import { mapToClassDTO } from './class.js';
import { mapToStudentDTO } from './student.js';
import { GroupDTO } from '@dwengo-1/common/interfaces/group';

export function mapToGroupDTO(group: Group): GroupDTO {
    return {
        class: mapToClassDTO(group.assignment.within),
        assignment: mapToAssignmentDTO(group.assignment),
        groupNumber: group.groupNumber!,
        members: group.members.map(mapToStudentDTO),
    };
}

export function mapToGroupDTOId(group: Group): GroupDTO {
    return {
        class: group.assignment.within.classId!,
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
        members: group.members.map((member) => member.username),
    };
}
