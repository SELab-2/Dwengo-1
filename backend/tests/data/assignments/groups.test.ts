import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { GroupRepository } from '../../../src/data/assignments/group-repository';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
} from '../../../src/data/repositories';
import { AssignmentRepository } from '../../../src/data/assignments/assignment-repository';
import { ClassRepository } from '../../../src/data/classes/class-repository';

describe('GroupRepository', () => {
    let groupRepository: GroupRepository;
    let assignmentRepository: AssignmentRepository;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        groupRepository = getGroupRepository();
        assignmentRepository = getAssignmentRepository();
        classRepository = getClassRepository();
    });

    it('should return the requested group', async () => {
        const class_ = await classRepository.findById('id01');
        const assignment = await assignmentRepository.findByClassAndId(
            class_!,
            1
        );

        const group = await groupRepository.findByAssignmentAndGroupNumber(
            assignment!,
            1
        );

        expect(group).toBeTruthy();
    });

    it('should return all groups for assignment', async () => {
        const class_ = await classRepository.findById('id01');
        const assignment = await assignmentRepository.findByClassAndId(
            class_!,
            1
        );

        const groups = await groupRepository.findAllGroupsForAssignment(
            assignment!
        );

        expect(groups).toBeTruthy();
        expect(groups).toHaveLength(3);
    });

    it('should not find removed group', async () => {
        const class_ = await classRepository.findById('id02');
        const assignment = await assignmentRepository.findByClassAndId(
            class_!,
            2
        );

        await groupRepository.deleteByAssignmentAndGroupNumber(assignment!, 1);

        const group = await groupRepository.findByAssignmentAndGroupNumber(
            assignment!,
            1
        );

        expect(group).toBeNull();
    });
});
