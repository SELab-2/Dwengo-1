import { EntityDTO } from '@mikro-orm/core';
import { getGroupRepository, getSubmissionRepository } from '../data/repositories.js';
import { Group } from '../entities/assignments/group.entity.js';
import { mapToGroupDTO, mapToGroupDTOId, mapToShallowGroupDTO } from '../interfaces/group.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId } from '../interfaces/submission.js';
import { GroupDTO, GroupDTOId } from '@dwengo-1/common/interfaces/group';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import { fetchAssignment } from './assignments.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { putObject } from './service-helper.js';
import { fetchStudents } from './students.js';

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
    return mapToGroupDTO(group, group.assignment.within);
}

export async function putGroup(
    classId: string,
    assignmentNumber: number,
    groupNumber: number,
    groupData: Partial<EntityDTO<Group>>
): Promise<GroupDTO> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);

    await putObject<Group>(group, groupData, getGroupRepository());

    return mapToGroupDTO(group, group.assignment.within);
}

export async function deleteGroup(classId: string, assignmentNumber: number, groupNumber: number): Promise<GroupDTO> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);
    const assignment = await fetchAssignment(classId, assignmentNumber);

    const groupRepository = getGroupRepository();
    await groupRepository.deleteByAssignmentAndGroupNumber(assignment, groupNumber);

    return mapToGroupDTO(group, assignment.within);
}

export async function getExistingGroupFromGroupDTO(groupData: GroupDTO): Promise<Group> {
    const classId = typeof groupData.class === 'string' ? groupData.class : groupData.class.id;
    const assignmentNumber = typeof groupData.assignment === 'number' ? groupData.assignment : groupData.assignment.id;
    const groupNumber = groupData.groupNumber;

    return await fetchGroup(classId, assignmentNumber, groupNumber);
}

export async function createGroup(groupData: GroupDTO, classid: string, assignmentNumber: number): Promise<GroupDTO> {
    const memberUsernames = (groupData.members as string[]) || [];
    const members = await fetchStudents(memberUsernames);

    const assignment = await fetchAssignment(classid, assignmentNumber);

    const groupRepository = getGroupRepository();
    const newGroup = groupRepository.create({
        assignment: assignment,
        members: members
    });

    await groupRepository.save(newGroup);

    return mapToGroupDTO(newGroup, newGroup.assignment.within);
}

export async function getAllGroups(classId: string, assignmentNumber: number, full: boolean): Promise<GroupDTO[] | GroupDTOId[]> {
    const assignment = await fetchAssignment(classId, assignmentNumber);

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsForAssignment(assignment);

    if (full) {
        return groups.map(group => mapToGroupDTO(group, assignment.within));
    }

    return groups.map(group => mapToGroupDTOId(group, assignment.within));
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
