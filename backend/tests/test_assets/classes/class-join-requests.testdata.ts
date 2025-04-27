import { EntityManager } from '@mikro-orm/core';
import { ClassJoinRequest } from '../../../src/entities/classes/class-join-request.entity';
import { ClassStatus } from '@dwengo-1/common/util/class-join-request';
import { getPinkFloyd, getSmashingPumpkins, getTool } from '../users/students.testdata';
import { getClass02, getClass03 } from './classes.testdata';

export function makeTestClassJoinRequests(em: EntityManager): ClassJoinRequest[] {
    classJoinRequest01 = em.create(ClassJoinRequest, {
        requester: getPinkFloyd(),
        class: getClass02(),
        status: ClassStatus.Open,
    });

    classJoinRequest02 = em.create(ClassJoinRequest, {
        requester: getTool(),
        class: getClass02(),
        status: ClassStatus.Open,
    });

    classJoinRequest03 = em.create(ClassJoinRequest, {
        requester: getPinkFloyd(),
        class: getClass03(),
        status: ClassStatus.Open,
    });

    classJoinRequest04 = em.create(ClassJoinRequest, {
        requester: getSmashingPumpkins(),
        class: getClass03(),
        status: ClassStatus.Open,
    });

    return [classJoinRequest01, classJoinRequest02, classJoinRequest03, classJoinRequest04];
}

let classJoinRequest01: ClassJoinRequest;
let classJoinRequest02: ClassJoinRequest;
let classJoinRequest03: ClassJoinRequest;
let classJoinRequest04: ClassJoinRequest;

export function getClassJoinRequest01(): ClassJoinRequest{
    return classJoinRequest01;
}

export function getClassJoinRequest02(): ClassJoinRequest{
    return classJoinRequest02;
}

export function getClassJoinRequest03(): ClassJoinRequest{
    return classJoinRequest03;
}

export function getClassJoinRequest04(): ClassJoinRequest{
    return classJoinRequest04;
}