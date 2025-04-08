import { Group } from '../entities/assignments/group.entity.js';
import {mapToAssignment, mapToAssignmentDTO, mapToAssignmentDTOId} from './assignment.js';
import {mapToStudent, mapToStudentDTO} from './student.js';
import {GroupDTO} from '@dwengo-1/common/interfaces/group';
import {getGroupRepository} from "../data/repositories";
import {AssignmentDTO} from "@dwengo-1/common/interfaces/assignment";
import {Class} from "../entities/classes/class.entity";
import {StudentDTO} from "@dwengo-1/common/interfaces/student";

export function mapToGroup(groupDto: GroupDTO, clazz: Class): Group {
    const assignmentDto = groupDto.assignment as AssignmentDTO;

    return getGroupRepository().create({
        groupNumber: groupDto.groupNumber,
        assignment: mapToAssignment(assignmentDto, clazz),
        members: groupDto.members!.map(studentDto => mapToStudent(studentDto as StudentDTO))
    });
}

export function mapToGroupDTO(group: Group): GroupDTO {
    return {
        assignment: mapToAssignmentDTO(group.assignment), // ERROR: , group.assignment.within),
        groupNumber: group.groupNumber!,
        members: group.members.map(mapToStudentDTO),
    };
}

export function mapToGroupDTOId(group: Group): GroupDTO {
    return {
        assignment: mapToAssignmentDTOId(group.assignment),
        groupNumber: group.groupNumber!,
    };
}

/**
 * Map to group DTO where other objects are only referenced by their id.
 */
export function mapToShallowGroupDTO(group: Group): GroupDTO {
    return {
        assignment: group.assignment.id!,
        groupNumber: group.groupNumber!,
        members: group.members.map((member) => member.username),
    };
}
