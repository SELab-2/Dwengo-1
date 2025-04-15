import { Group } from '../entities/assignments/group.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import {mapToAssignmentDTOId} from './assignment.js';
import { mapToClassDTO } from './class.js';
import { mapToStudentDTO } from './student.js';
import { GroupDTO } from '@dwengo-1/common/interfaces/group';

export function mapToGroupDTO(group: Group, cls: Class): GroupDTO {
    return {
        class: mapToClassDTO(cls),
        assignment: mapToAssignmentDTOId(group.assignment),
        groupNumber: group.groupNumber!,
        members: group.members.map(mapToStudentDTO),
    };
}

export function mapToGroupDTOId(group: Group, cls: Class): GroupDTO {
    return {
        class: cls.classId!,
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
        members: group.members.map((member) => member.username),
    };
}
