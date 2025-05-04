import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { GroupRepository } from '../../../src/data/assignments/group-repository';
import { getAssignmentRepository, getClassRepository, getGroupRepository } from '../../../src/data/repositories';
import { AssignmentRepository } from '../../../src/data/assignments/assignment-repository';
import { ClassRepository } from '../../../src/data/classes/class-repository';
import {getClass01, getClass02} from "../../test_assets/classes/classes.testdata";

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
        const id = getClass01().classId;
        const class_ = await classRepository.findById(id);
        const assignment = await assignmentRepository.findByClassAndId(class_!, 21000);

        const group = await groupRepository.findByAssignmentAndGroupNumber(assignment!, 21001);

        expect(group).toBeTruthy();
    });

    it('should return all groups for assignment', async () => {
        const class_ = await classRepository.findById(getClass01().classId);
        const assignment = await assignmentRepository.findByClassAndId(class_!, 21000);

        const groups = await groupRepository.findAllGroupsForAssignment(assignment!);

        expect(groups).toBeTruthy();
        expect(groups).toHaveLength(3);
    });

    it('should not find removed group', async () => {
        const class_ = await classRepository.findById(getClass02().classId);
        const assignment = await assignmentRepository.findByClassAndId(class_!, 21001);

        await groupRepository.deleteByAssignmentAndGroupNumber(assignment!, 21001);

        const group = await groupRepository.findByAssignmentAndGroupNumber(assignment!, 1);

        expect(group).toBeNull();
    });
});
