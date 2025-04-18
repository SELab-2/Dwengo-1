import { EntityManager } from '@mikro-orm/core';
import { ClassJoinRequest } from '../../../src/entities/classes/class-join-request.entity';
import { Student } from '../../../src/entities/users/student.entity';
import { Class } from '../../../src/entities/classes/class.entity';
import { ClassStatus } from '@dwengo-1/common/util/class-join-request';

export let classJoinRequest01: ClassJoinRequest;
export let classJoinRequest02: ClassJoinRequest;
export let classJoinRequest03: ClassJoinRequest;
export let classJoinRequest04: ClassJoinRequest;

export let TEST_CLASS_JOIN_REQUESTS: ClassJoinRequest[];

export function makeTestClassJoinRequests(em: EntityManager, students: Student[], classes: Class[]): ClassJoinRequest[] {
    classJoinRequest01 = em.create(ClassJoinRequest, {
        requester: students[4],
        class: classes[1],
        status: ClassStatus.Open,
    });

    classJoinRequest02 = em.create(ClassJoinRequest, {
        requester: students[2],
        class: classes[1],
        status: ClassStatus.Open,
    });

    classJoinRequest03 = em.create(ClassJoinRequest, {
        requester: students[4],
        class: classes[2],
        status: ClassStatus.Open,
    });

    classJoinRequest04 = em.create(ClassJoinRequest, {
        requester: students[3],
        class: classes[2],
        status: ClassStatus.Open,
    });

    TEST_CLASS_JOIN_REQUESTS = [classJoinRequest01, classJoinRequest02, classJoinRequest03, classJoinRequest04];
    return TEST_CLASS_JOIN_REQUESTS;
}
