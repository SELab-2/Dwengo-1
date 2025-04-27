import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { GroupRepository } from '../../../src/data/assignments/group-repository';
import { getAssignmentRepository, getClassRepository, getGroupRepository } from '../../../src/data/repositories';
import { getClass01 } from '../../test_assets/classes/classes.testdata';
import { getAssignment01, getAssignment02 } from '../../test_assets/assignments/assignments.testdata';
import { getTestGroup01, getTestGroup02, getTestGroup03 } from '../../test_assets/assignments/groups.testdata';
import { getDireStraits, getNoordkaap } from '../../test_assets/users/students.testdata';

describe('GroupRepository', () => {
    let groupRepository: GroupRepository;

    beforeAll(async () => {
        await setupTestApp();
        groupRepository = getGroupRepository();
    });

    it('should return the requested group', async () => {
        const assignment = getAssignment01();
        const usedGroup = getTestGroup01();
        const member1 = getNoordkaap();
        const member2 = getDireStraits();

        const group = await groupRepository.findByAssignmentAndGroupNumber(assignment!, usedGroup.groupNumber!);

        expect(group).toBeTruthy();
        expect(group?.groupNumber).toBe(usedGroup.groupNumber);
        expect(group!.members[0].username).toBeOneOf([member1.username, member2.username]);
        expect(group!.members[1].username).toBeOneOf([member1.username, member2.username]);
        expect(group!.assignment.id).toBe(usedGroup.assignment.id);
    });

    it('should return all groups for assignment', async () => {
        const assignment = getAssignment01();
        const gr1 = getTestGroup01();
        const gr2 = getTestGroup02();
        const gr3 = getTestGroup03();

        const groups = await groupRepository.findAllGroupsForAssignment(assignment!);

        expect(groups).toBeTruthy();
        expect(groups).toHaveLength(3);
        expect(groups[0].groupNumber).toBeOneOf([gr1.groupNumber, gr2.groupNumber, gr3.groupNumber]);
        expect(groups[1].groupNumber).toBeOneOf([gr1.groupNumber, gr2.groupNumber, gr3.groupNumber]);
        expect(groups[2].groupNumber).toBeOneOf([gr1.groupNumber, gr2.groupNumber, gr3.groupNumber]);
    });

    it('should not find removed group', async () => {
        const assignment = getAssignment02();
        const deleted = getTestGroup01();

        await groupRepository.deleteByAssignmentAndGroupNumber(assignment!, deleted.groupNumber!);

        const group = await groupRepository.findByAssignmentAndGroupNumber(assignment!, deleted.groupNumber!);

        expect(group).toBeNull();
    });
});
