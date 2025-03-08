import { Group } from "../entities/assignments/group.entity";
import { AssignmentDTO, mapToAssignmentDTO } from "./assignments";
import { mapToStudentDTO, StudentDTO } from "./students";

export interface GroupDTO {
    assignment: number | AssignmentDTO,
    groupNumber: number,
    members: string[] | StudentDTO[],
};

export function mapToGroupDTO(group: Group): GroupDTO {
    return {
        assignment: mapToAssignmentDTO(group.assignment, group.assignment.within),
        groupNumber: group.groupNumber,
        members: group.members.map(mapToStudentDTO),
    }
}

export function mapToGroupDTOId(group: Group): GroupDTO {
    return {
        assignment: group.assignment.id,
        groupNumber: group.groupNumber,
        members: group.members.map(member => member.username),
    }
}