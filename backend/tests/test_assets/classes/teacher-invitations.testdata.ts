import { EntityManager } from '@mikro-orm/core';
import { TeacherInvitation } from '../../../src/entities/classes/teacher-invitation.entity';
import { ClassStatus } from '@dwengo-1/common/util/class-join-request';
import { getFooFighters, getLimpBizkit, getStaind } from '../users/teachers.testdata';
import { getClass01, getClass02, getClass03 } from './classes.testdata';

export function makeTestTeacherInvitations(em: EntityManager): TeacherInvitation[] {
    teacherInvitation01 = em.create(TeacherInvitation, {
        sender: getLimpBizkit(),
        receiver: getFooFighters(),
        class: getClass02(),
        status: ClassStatus.Open,
    });

    teacherInvitation02 = em.create(TeacherInvitation, {
        sender: getLimpBizkit(),
        receiver: getStaind(),
        class: getClass02(),
        status: ClassStatus.Open,
    });

    teacherInvitation03 = em.create(TeacherInvitation, {
        sender: getStaind(),
        receiver: getFooFighters(),
        class: getClass03(),
        status: ClassStatus.Open,
    });

    // Gets deleted in test
    teacherInvitation04 = em.create(TeacherInvitation, {
        sender: getFooFighters(),
        receiver: getLimpBizkit(),
        class: getClass01(),
        status: ClassStatus.Open,
    });

    return [teacherInvitation01, teacherInvitation02, teacherInvitation03, teacherInvitation04];
}

let teacherInvitation01: TeacherInvitation;
let teacherInvitation02: TeacherInvitation;
let teacherInvitation03: TeacherInvitation;
let teacherInvitation04: TeacherInvitation;

export function getTeacherInvitation01(): TeacherInvitation {
    return teacherInvitation01;
}

export function getTeacherInvitation02(): TeacherInvitation {
    return teacherInvitation02;
}

export function getTeacherInvitation03(): TeacherInvitation {
    return teacherInvitation03;
}

export function getTeacherInvitation04(): TeacherInvitation {
    return teacherInvitation04;
}
