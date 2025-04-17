import { Group } from '../entities/assignments/group.entity.js';
import { mapToAssignment } from './assignment.js';
import { mapToStudent } from './student.js';
import { mapToAssignmentDTO } from './assignment.js';
import { mapToStudentDTO } from './student.js';
import { GroupDTO, GroupDTOId } from '@dwengo-1/common/interfaces/group';
import { getGroupRepository } from '../data/repositories.js';
import { AssignmentDTO } from '@dwengo-1/common/interfaces/assignment';
import { Class } from '../entities/classes/class.entity.js';
import { StudentDTO } from '@dwengo-1/common/interfaces/student';
import { mapToClassDTO } from './class.js';

export function mapToGroup(groupDto: GroupDTO, clazz: Class): Group {
    const assignmentDto = groupDto.assignment as AssignmentDTO;

    return getGroupRepository().create({
        groupNumber: groupDto.groupNumber,
        assignment: mapToAssignment(assignmentDto, clazz),
        members: groupDto.members!.map((studentDto) => mapToStudent(studentDto as StudentDTO)),
    });
}

export function mapToGroupDTO(group: Group, cls: Class): GroupDTO {
    return {
        class: cls.classId!,
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
        members: group.members.map(mapToStudentDTO),
    };
}

export function mapToGroupDTOId(group: Group, cls: Class): GroupDTOId {
    return {
        class: cls.classId!,
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
    };
}

/**
 * Map to group DTO where other objects are only referenced by their id.
 */
export function mapToShallowGroupDTO(group: Group): GroupDTO {
    return {
        class: group.assignment.within.classId!,
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
        members: group.members.map((member) => member.username),
    };
}
