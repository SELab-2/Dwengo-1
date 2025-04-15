import { Group } from '../entities/assignments/group.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import {mapToAssignmentDTOId} from './assignment.js';
import { mapToClassDTO } from './class.js';
import { mapToStudentDTO } from './student.js';
import { GroupDTO, GroupDTOId } from '@dwengo-1/common/interfaces/group';

export function mapToGroupDTO(group: Group, cls: Class, options?: { expandStudents: boolean }): GroupDTO {
    return {
        class: cls.classId!,
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
        members: 
            options?.expandStudents 
            ? group.members.map(mapToStudentDTO)
            : group.members.map((student) => student.username)

    };
}

export function mapToGroupDTOId(group: Group, cls: Class): GroupDTOId {
    return {
        class: cls.classId!,
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
    };
}
