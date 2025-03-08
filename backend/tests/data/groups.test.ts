import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../setup-tests';
import { GroupRepository } from '../../src/data/assignments/group-repository';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
} from '../../src/data/repositories';
import { AssignmentRepository } from '../../src/data/assignments/assignment-repository';
import { ClassRepository } from '../../src/data/classes/class-repository';
import { Class } from '../../src/entities/classes/class.entity';

describe('GroupRepository', () => {
    let GroupRepository: GroupRepository;
    let AssignmentRepository: AssignmentRepository;
    let ClassRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        GroupRepository = getGroupRepository();
        AssignmentRepository = getAssignmentRepository();
        ClassRepository = getClassRepository();
    });

    it('should return the requested group', async () => {
        const class_ = await ClassRepository.findById('id01');
        const assignment = await AssignmentRepository.findByClassAndId(
            class_!,
            1
        );

        const group = await GroupRepository.findByAssignmentAndGroupNumber(
            assignment!,
            1
        );

        expect(group).toBeTruthy();
    });

    it('should return all groups for assignment', async () => {
        const class_ = await ClassRepository.findById('id01');
        const assignment = await AssignmentRepository.findByClassAndId(
            class_!,
            1
        );

        const groups = await GroupRepository.findAllGroupsForAssignment(
            assignment!
        );

        expect(groups).toBeTruthy();
        expect(groups).toHaveLength(3);
    });

    // it('should not find removed group', async () => {
    //     const class_ = await ClassRepository.findById('id02');
    //     const assignment = await AssignmentRepository.findByClassAndId(
    //         class_!,
    //         1
    //     );
    //     await GroupRepository.deleteByAssignmentAndGroupNumber(assignment!, 1);

    //     const group = await GroupRepository.findByAssignmentAndGroupNumber(
    //         assignment!,
    //         1
    //     );

    //     expect(group).toBeNull();
    // });
});
