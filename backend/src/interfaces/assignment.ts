import { FALLBACK_LANG } from '../config.js';
import { Assignment } from '../entities/assignments/assignment.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import { languageMap } from '../entities/content/language.js';
import { GroupDTO, mapToGroupDTO } from './group.js';

export interface AssignmentDTO {
    id: number;
    class: string; // Id of class 'within'
    title: string;
    description: string;
    learningPath: string;
    language: string;
    groups?: GroupDTO[] | string[]; // TODO
}

export function mapToAssignmentDTOId(assignment: Assignment): AssignmentDTO {
    return {
        id: assignment.id!,
        class: assignment.within.classId,
        title: assignment.title,
        description: assignment.description,
        learningPath: assignment.learningPathHruid,
        language: assignment.learningPathLanguage,
        // Groups: assignment.groups.map(group => group.groupNumber),
    };
}

export function mapToAssignmentDTO(assignment: Assignment): AssignmentDTO {
    return {
        id: assignment.id!,
        class: assignment.within.classId,
        title: assignment.title,
        description: assignment.description,
        learningPath: assignment.learningPathHruid,
        language: assignment.learningPathLanguage,
        // Groups: assignment.groups.map(mapToGroupDTO),
    };
}

export function mapToAssignment(assignmentData: AssignmentDTO, cls: Class): Assignment {
    const assignment = new Assignment();
    assignment.title = assignmentData.title;
    assignment.description = assignmentData.description;
    assignment.learningPathHruid = assignmentData.learningPath;
    assignment.learningPathLanguage = languageMap[assignmentData.language] || FALLBACK_LANG;
    assignment.within = cls;

    console.log(assignment);

    return assignment;
}
