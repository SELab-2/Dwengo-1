import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../setup-tests';
import {
    getClassRepository,
    getTeacherInvitationRepository,
    getTeacherRepository,
} from '../../src/data/repositories';
import { TeacherInvitationRepository } from '../../src/data/classes/teacher-invitation-repository';
import { TeacherRepository } from '../../src/data/users/teacher-repository';
import { ClassRepository } from '../../src/data/classes/class-repository';

describe('ClassRepository', () => {
    let TeacherInvitationRepository: TeacherInvitationRepository;
    let TeacherRepository: TeacherRepository;
    let ClassRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        TeacherInvitationRepository = getTeacherInvitationRepository();
        TeacherRepository = getTeacherRepository();
        ClassRepository = getClassRepository();
    });

    it('should return all invitations from a teacher', async () => {
        const teacher = await TeacherRepository.findByUsername('LimpBizkit');
        const invitations =
            await TeacherInvitationRepository.findAllInvitationsBy(teacher!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
    });

    it('should return all invitations for a teacher', async () => {
        const teacher = await TeacherRepository.findByUsername('FooFighters');
        const invitations =
            await TeacherInvitationRepository.findAllInvitationsFor(teacher!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
    });

    it('should return all invitations for a class', async () => {
        const class_ = await ClassRepository.findById('id02');
        const invitations =
            await TeacherInvitationRepository.findAllInvitationsForClass(
                class_!
            );

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
    });

    it('should not find a removed invitation', async () => {
        const class_ = await ClassRepository.findById('id01');
        const sender = await TeacherRepository.findByUsername('FooFighters');
        const receiver = await TeacherRepository.findByUsername('LimpBizkit');
        await TeacherInvitationRepository.deleteBy(class_!, sender!, receiver!);

        const invitation =
            await TeacherInvitationRepository.findAllInvitationsBy(sender!);

        expect(invitation).toHaveLength(0);
    });
});
