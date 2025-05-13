import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { getTeacherInvitationRepository, getTeacherRepository } from '../../../src/data/repositories';
import { TeacherInvitationRepository } from '../../../src/data/classes/teacher-invitation-repository';
import { getFooFighters, getLimpBizkit } from '../../test_assets/users/teachers.testdata';
import { getTeacherInvitation01, getTeacherInvitation02, getTeacherInvitation03 } from '../../test_assets/classes/teacher-invitations.testdata';
import { getClass01, getClass02 } from '../../test_assets/classes/classes.testdata';

describe('ClassRepository', () => {
    let teacherInvitationRepository: TeacherInvitationRepository;

    beforeAll(async () => {
        await setupTestApp();
        teacherInvitationRepository = getTeacherInvitationRepository();
    });

    it('should return all invitations from a teacher', async () => {
        const teacher = getLimpBizkit();
        const ti1 = getTeacherInvitation01();
        const ti2 = getTeacherInvitation02();
        const invitations = await teacherInvitationRepository.findAllInvitationsBy(teacher!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
        expect(invitations[0].class.classId).toBeOneOf([ti1.class.classId, ti2.class.classId]);
        expect(invitations[1].class.classId).toBeOneOf([ti1.class.classId, ti2.class.classId]);
    });

    it('should return all invitations for a teacher', async () => {
        const teacher = getFooFighters();
        const ti1 = getTeacherInvitation01();
        const ti2 = getTeacherInvitation03();
        const invitations = await teacherInvitationRepository.findAllInvitationsFor(teacher!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
        expect(invitations[0].class.classId).toBeOneOf([ti1.class.classId, ti2.class.classId]);
        expect(invitations[1].class.classId).toBeOneOf([ti1.class.classId, ti2.class.classId]);
    });

    it('should return all invitations for a class', async () => {
        const class_ = getClass02();
        const ti1 = getTeacherInvitation01();
        const ti2 = getTeacherInvitation02();
        const invitations = await teacherInvitationRepository.findAllInvitationsForClass(class_!);

        expect(invitations).toBeTruthy();
        expect(invitations).toHaveLength(2);
        expect(invitations[0].class.classId).toBeOneOf([ti1.class.classId, ti2.class.classId]);
        expect(invitations[1].class.classId).toBeOneOf([ti1.class.classId, ti2.class.classId]);

    });

    it('should not find a removed invitation', async () => {
        const class_ = getClass01();
        const sender = getFooFighters();
        const receiver = getLimpBizkit();
        await teacherInvitationRepository.deleteBy(class_!, sender!, receiver!);

        const invitation = await teacherInvitationRepository.findAllInvitationsBy(sender!);

        expect(invitation).toHaveLength(0);
    });
});
