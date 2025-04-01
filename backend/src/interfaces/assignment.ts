import { languageMap } from 'dwengo-1-common/src/util/language.js';
import { FALLBACK_LANG } from '../config.js';
import { Assignment } from '../entities/assignments/assignment.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import { getLogger } from '../logging/initalize.js';
import { AssignmentDTO } from 'dwengo-1-common/src/interfaces/assignment';

export function mapToAssignmentDTOId(assignment: Assignment): AssignmentDTO {
    return {
        id: assignment.id!,
        class: assignment.within.classId!,
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
        class: assignment.within.classId!,
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

    getLogger().debug(assignment);

    return assignment;
}
