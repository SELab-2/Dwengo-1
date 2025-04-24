import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { getClassRepository, getTeacherInvitationRepository, getTeacherRepository } from '../../../src/data/repositories';
import { TeacherInvitationRepository } from '../../../src/data/classes/teacher-invitation-repository';
import { TeacherRepository } from '../../../src/data/users/teacher-repository';
import { ClassRepository } from '../../../src/data/classes/class-repository';

describe('ClassRepository', () => {
    let teacherInvitationRepository: TeacherInvitationRepository;
    let teacherRepository: TeacherRepository;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        teacherInvitationRepository = getTeacherInvitationRepository();
        teacherRepository = getTeacherRepository();
        classRepository = getClassRepository();
    });

    it('should return all invitations from a teacher', async () => {
        const teacher = await teacherRepository.findByUsername('LimpBizkit');
        const invitations = await teacherInvitationRepository.findAllInvitationsBy(teacher!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
    });

    it('should return all invitations for a teacher', async () => {
        const teacher = await teacherRepository.findByUsername('FooFighters');
        const invitations = await teacherInvitationRepository.findAllInvitationsFor(teacher!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
    });

    it('should return all invitations for a class', async () => {
        const class_ = await classRepository.findById('34d484a1-295f-4e9f-bfdc-3e7a23d86a89');
        const invitations = await teacherInvitationRepository.findAllInvitationsForClass(class_!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
    });

    it('should not find a removed invitation', async () => {
        const class_ = await classRepository.findById('8764b861-90a6-42e5-9732-c0d9eb2f55f9');
        const sender = await teacherRepository.findByUsername('FooFighters');
        const receiver = await teacherRepository.findByUsername('LimpBizkit');
        await teacherInvitationRepository.deleteBy(class_!, sender!, receiver!);

        const invitation = await teacherInvitationRepository.findAllInvitationsBy(sender!);

        expect(invitation).toHaveLength(0);
    });
});
