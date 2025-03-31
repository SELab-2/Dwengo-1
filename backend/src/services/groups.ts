import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../data/repositories.js';
import { Group } from '../entities/assignments/group.entity.js';
import { mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId, SubmissionDTO, SubmissionDTOId } from '../interfaces/submission.js';
import { GroupDTO } from 'dwengo-1-common/src/interfaces/group';

export async function getGroup(classId: string, assignmentNumber: number, groupNumber: number, full: boolean): Promise<GroupDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return null;
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, assignmentNumber);

    if (!assignment) {
        return null;
    }

    const groupRepository = getGroupRepository();
    const group = await groupRepository.findByAssignmentAndGroupNumber(assignment, groupNumber);

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
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, assignmentNumber);

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
    full: boolean
): Promise<SubmissionDTO[] | SubmissionDTOId[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, assignmentNumber);

    if (!assignment) {
        return [];
    }

    const groupRepository = getGroupRepository();
    const group = await groupRepository.findByAssignmentAndGroupNumber(assignment, groupNumber);

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
