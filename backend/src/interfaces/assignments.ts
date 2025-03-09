import { Assignment } from "../entities/assignments/assignment.entity";
import { Class } from "../entities/classes/class.entity";
import { GroupDTO, mapToGroupDTO } from "./groups";

export interface AssignmentDTO {
    id: number,
    class: string, // id of class 'within'
    title: string,
    description: string,
    learningPath: string,
    language: string,
    groups?: GroupDTO[] | string[], // TODO
}

export function mapToAssignmentDTOId(assignment: Assignment): AssignmentDTO {
    return {
        id: assignment.id,
        class: assignment.within.classId,
        title: assignment.title,
        description: assignment.description,
        learningPath: assignment.learningPathHruid,
        language: assignment.learningPathLanguage,
        // groups: assignment.groups.map(group => group.groupNumber),
    }
}

export function mapToAssignmentDTO(assignment: Assignment): AssignmentDTO {
    return {
        id: assignment.id,
        class: assignment.within.classId,
        title: assignment.title,
        description: assignment.description,
        learningPath: assignment.learningPathHruid,
        language: assignment.learningPathLanguage,
        // groups: assignment.groups.map(mapToGroupDTO),
    };
}