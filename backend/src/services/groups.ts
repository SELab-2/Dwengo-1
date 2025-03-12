import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getSubmissionRepository,
} from '../data/repositories.js';
import {
    GroupDTO,
    mapToGroupDTO,
    mapToGroupDTOId,
} from '../interfaces/group.js';
import { mapToSubmissionDTO, SubmissionDTO } from '../interfaces/submission.js';

export async function getGroup(
    classId: string,
    assignmentNumber: number,
    groupNumber: number,
    full: boolean
): Promise<GroupDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return null;
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(
        cls,
        assignmentNumber
    );

    if (!assignment) {
        return null;
    }

    const groupRepository = getGroupRepository();
    const group = await groupRepository.findByAssignmentAndGroupNumber(
        assignment,
        groupNumber
    );

    if (!group) {
        return null;
    }

    if (full) {
        return mapToGroupDTO(group);
    }

    return mapToGroupDTOId(group);
}

export async function getAllGroups(
    classId: string,
    assignmentNumber: number,
    full: boolean
): Promise<GroupDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(
        cls,
        assignmentNumber
    );

    if (!assignment) {
        return [];
    }

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsForAssignment(assignment);

    if (full) {
        console.log('full');
        console.log(groups);
        return groups.map(mapToGroupDTO);
    }

    return groups.map(mapToGroupDTOId);
}

export async function getGroupSubmissions(
    classId: string,
    assignmentNumber: number,
    groupNumber: number,
): Promise<SubmissionDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(
        cls,
        assignmentNumber
    );

    if (!assignment) {
        return [];
    }

    const groupRepository = getGroupRepository();
    const group = await groupRepository.findByAssignmentAndGroupNumber(
        assignment,
        groupNumber
    );

    if (!group) {
        return [];
    }

    const submissionRepository = getSubmissionRepository();
    const submissions = await submissionRepository.findAllSubmissionsForGroup(group);

    return submissions.map(mapToSubmissionDTO);
}
