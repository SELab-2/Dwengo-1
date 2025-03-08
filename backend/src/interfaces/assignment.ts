import { Assignment } from "../entities/assignments/assignment.entity";
import { Class } from "../entities/classes/class.entity";
import { GroupDTO } from "./group";

export interface AssignmentDTO {
    id: number,
    class: string, // id of class 'within'
    title: string,
    description: string,
    learningPath: string,
    language: string,
    groups?: GroupDTO[], // TODO
}

export function mapToAssignmentDTO(assignment: Assignment, cls: Class): AssignmentDTO {
    return {
        id: assignment.id,
        class: cls.classId,
        title: assignment.title,
        description: assignment.description,
        learningPath: assignment.learningPathHruid,
        language: assignment.learningPathLanguage,
        //groups: assignment.groups.map(mapToGroupDTO),
    };
}
