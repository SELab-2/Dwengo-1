import { EntityManager } from '@mikro-orm/core';
import { TeacherInvitation } from '../../../src/entities/classes/teacher-invitation.entity';
import { Teacher } from '../../../src/entities/users/teacher.entity';
import { Class } from '../../../src/entities/classes/class.entity';

export let teacherInvitation01: TeacherInvitation;
export let teacherInvitation02: TeacherInvitation;
export let teacherInvitation03: TeacherInvitation;
export let teacherInvitation04: TeacherInvitation;

export let TEST_TEACHER_INVITATIONS: TeacherInvitation[];

export function makeTestTeacherInvitations(em: EntityManager, teachers: Teacher[], classes: Class[]): TeacherInvitation[] {
    teacherInvitation01 = em.create(TeacherInvitation, {
        sender: teachers[1],
        receiver: teachers[0],
        class: classes[1],
    });

    teacherInvitation02 = em.create(TeacherInvitation, {
        sender: teachers[1],
        receiver: teachers[2],
        class: classes[1],
    });

    teacherInvitation03 = em.create(TeacherInvitation, {
        sender: teachers[2],
        receiver: teachers[0],
        class: classes[2],
    });

    teacherInvitation04 = em.create(TeacherInvitation, {
        sender: teachers[0],
        receiver: teachers[1],
        class: classes[0],
    });

    TEST_TEACHER_INVITATIONS = [teacherInvitation01, teacherInvitation02, teacherInvitation03, teacherInvitation04];
    return TEST_TEACHER_INVITATIONS;
}
