import { languageMap } from '@dwengo-1/common/util/language';
import { Assignment } from '../entities/assignments/assignment.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import { AssignmentDTO, AssignmentDTOId } from '@dwengo-1/common/interfaces/assignment';
import { mapToGroupDTO } from './group.js';
import { getAssignmentRepository } from '../data/repositories.js';

export function mapToAssignmentDTOId(assignment: Assignment): AssignmentDTOId {
    return {
        id: assignment.id!,
        within: assignment.within.classId!,
    };
}

export function mapToAssignmentDTO(assignment: Assignment): AssignmentDTO {
    return {
        id: assignment.id!,
        within: assignment.within.classId!,
        title: assignment.title,
        description: assignment.description,
        learningPath: assignment.learningPathHruid,
        language: assignment.learningPathLanguage,
        deadline: assignment.deadline ?? new Date(),
        groups: assignment.groups.map((group) => mapToGroupDTO(group, assignment.within)),
    };
}

export function mapToAssignment(assignmentData: AssignmentDTO, cls: Class): Assignment {
    return getAssignmentRepository().create({
        within: cls,
        title: assignmentData.title,
        description: assignmentData.description,
        learningPathHruid: assignmentData.learningPath,
        learningPathLanguage: languageMap[assignmentData.language],
        deadline: assignmentData.deadline,
        groups: [],
    });
}
