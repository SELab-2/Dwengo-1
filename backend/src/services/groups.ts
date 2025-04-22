import { EntityDTO } from '@mikro-orm/core';
import { getGroupRepository, getQuestionRepository, getSubmissionRepository } from '../data/repositories.js';
import { Group } from '../entities/assignments/group.entity.js';
import { mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId } from '../interfaces/submission.js';
import { GroupDTO, GroupDTOId } from '@dwengo-1/common/interfaces/group';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import { fetchAssignment } from './assignments.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { fetchStudents } from './students.js';
import { fetchClass } from './classes.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { Student } from '../entities/users/student.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import { QuestionDTO, QuestionId } from 'dwengo-1-common/interfaces/question';
import { mapToQuestionDTO, mapToQuestionDTOId } from '../interfaces/question.js';

async function assertMembersInClass(members: Student[], cls: Class): Promise<void> {
    if (!members.every((student) => cls.students.contains(student))) {
        throw new BadRequestException('Student does not belong to class');
    }
}

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

export async function putGroup(classId: string, assignmentNumber: number, groupNumber: number, groupData: Partial<GroupDTO>): Promise<GroupDTO> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);

    const memberUsernames = groupData.members as string[];
    const members = await fetchStudents(memberUsernames);

    const cls = await fetchClass(classId);
    await assertMembersInClass(members, cls);

    const groupRepository = getGroupRepository();
    groupRepository.assign(group, { members } as Partial<EntityDTO<Group>>);
    await groupRepository.getEntityManager().persistAndFlush(group);

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

    const cls = await fetchClass(classid);
    await assertMembersInClass(members, cls);

    const assignment = await fetchAssignment(classid, assignmentNumber);

    const groupRepository = getGroupRepository();
    const newGroup = groupRepository.create({
        assignment: assignment,
        members: members,
    });

    await groupRepository.save(newGroup);

    return mapToGroupDTO(newGroup, newGroup.assignment.within);
}

export async function getAllGroups(classId: string, assignmentNumber: number, full: boolean): Promise<GroupDTO[] | GroupDTOId[]> {
    const assignment = await fetchAssignment(classId, assignmentNumber);

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsForAssignment(assignment);

    if (full) {
        return groups.map((group) => mapToGroupDTO(group, assignment.within));
    }

    return groups.map((group) => mapToGroupDTOId(group, assignment.within));
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

export async function getGroupQuestions(
    classId: string,
    assignmentNumber: number,
    groupNumber: number,
    full: boolean
): Promise<QuestionDTO[] | QuestionId[]> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);

    const questionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllByGroup(group);

    if (full) {
        return questions.map(mapToQuestionDTO);
    }

    return questions.map(mapToQuestionDTOId);
}
