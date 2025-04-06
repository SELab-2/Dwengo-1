import { assign } from '@mikro-orm/core';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getQuestionRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../data/repositories.js';
import { Group } from '../entities/assignments/group.entity.js';
import { mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId } from '../interfaces/submission.js';
import { GroupDTO } from '@dwengo-1/common/interfaces/group';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import { getLogger } from '../logging/initalize.js';
import { fetchAssignment } from './assignments.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { fetchClass } from './classes.js';

export async function fetchGroup(classId: string, assignmentNumber: number, groupNumber: number): Promise<Group> {
    const assignment = await fetchAssignment(classId, assignmentNumber);

    const groupRepository = getGroupRepository();
    const group = await groupRepository.findByAssignmentAndGroupNumber(assignment, groupNumber);

    if (!group) {
        throw new NotFoundException('Could not find group');
    }

    return group; 
}

export async function getGroup(classId: string, assignmentNumber: number, groupNumber: number): Promise<GroupDTO> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);
    return mapToGroupDTO(group);
}

export async function deleteGroup(classId: string, assignmentNumber: number, groupNumber: number): Promise<GroupDTO> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);
    const assignment = await fetchAssignment(classId, assignmentNumber);
    
    const groupRepository = getGroupRepository();
    await groupRepository.deleteByAssignmentAndGroupNumber(assignment, groupNumber);

    return mapToGroupDTO(group);
}

export async function getExistingGroupFromGroupDTO(groupData: GroupDTO) {
    const classId = typeof(groupData.class) === 'string' ? groupData.class : groupData.class.id;
    const assignmentNumber = typeof(groupData.assignment) === 'number' ? groupData.assignment : groupData.assignment.id;
    const groupNumber = groupData.groupNumber;

    return await fetchGroup(classId, assignmentNumber, groupNumber);
}

export async function createGroup(groupData: GroupDTO, classid: string, assignmentNumber: number): Promise<GroupDTO> {
    const studentRepository = getStudentRepository();

    const memberUsernames = (groupData.members as string[]) || [];
    const members = (await Promise.all([...memberUsernames].map(async (id) => studentRepository.findByUsername(id)))).filter(
        (student) => student !== null
    );

    const assignment = await fetchAssignment(classid, assignmentNumber);

    const groupRepository = getGroupRepository();
    const newGroup = groupRepository.create({
        assignment: assignment,
        members: members,
    });
    await groupRepository.save(newGroup);

    return mapToGroupDTO(newGroup);
}

export async function getAllGroups(classId: string, assignmentNumber: number, full: boolean): Promise<GroupDTO[]> {
    const assignment = await fetchAssignment(classId, assignmentNumber);

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsForAssignment(assignment);

    if (full) {
        return groups.map(mapToGroupDTO);
    }

    return groups.map(mapToGroupDTOId);
}

export async function getGroupSubmissions(
    classId: string,
    assignmentNumber: number,
    groupNumber: number,
    full: boolean
): Promise<SubmissionDTO[] | SubmissionDTOId[]> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);

    const submissionRepository = getSubmissionRepository();
    const submissions = await submissionRepository.findAllSubmissionsForGroup(group);

    if (full) {
        return submissions.map(mapToSubmissionDTO);
    }

    return submissions.map(mapToSubmissionDTOId);
}
