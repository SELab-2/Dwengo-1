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
import { GroupDTO, mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId, SubmissionDTO, SubmissionDTOId } from '../interfaces/submission.js';
import { fetchAssignment } from './assignments.js';
import { mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId } from '../interfaces/question.js';

async function fetchGroup(classId: string, assignmentNumber: number, groupNumber: number): Promise<Group | null> {
    const assignment = await fetchAssignment(classId, assignmentNumber);

    if (!assignment) {
        return null;
    }

    const groupRepository = getGroupRepository();
    const group = await groupRepository.findByAssignmentAndGroupNumber(assignment, groupNumber);

    return group; 
}

export async function getGroup(classId: string, assignmentNumber: number, groupNumber: number, full: boolean): Promise<GroupDTO | null> {
    const group = await fetchGroup(classId, assignmentNumber, groupNumber);

    if (!group) {
        return null;
    }

    if (full) {
        return mapToGroupDTO(group);
    }

    return mapToGroupDTOId(group);
}

export async function createGroup(groupData: GroupDTO, classid: string, assignmentNumber: number): Promise<Group | null> {
    const studentRepository = getStudentRepository();

    const memberUsernames = (groupData.members as string[]) || []; // TODO check if groupdata.members is a list
    const members = (await Promise.all([...memberUsernames].map((id) => studentRepository.findByUsername(id)))).filter((student) => student !== null);

    console.log(members);

    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    if (!cls) {
        return null;
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, assignmentNumber);

    if (!assignment) {
        return null;
    }

    const groupRepository = getGroupRepository();
    try {
        const newGroup = groupRepository.create({
            assignment: assignment,
            members: members,
        });
        await groupRepository.save(newGroup);

        return newGroup;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getAllGroups(classId: string, assignmentNumber: number, full: boolean): Promise<GroupDTO[]> {
    const assignment = await fetchAssignment(classId, assignmentNumber);

    if (!assignment) {
        return [];
    }

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

    if (!group) {
        return [];
    }

    const submissionRepository = getSubmissionRepository();
    const submissions = await submissionRepository.findAllSubmissionsForGroup(group);

    if (full) {
        return submissions.map(mapToSubmissionDTO);
    }

    return submissions.map(mapToSubmissionDTOId);
}
