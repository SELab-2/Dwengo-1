import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import {
    ClassJoinRequest,
    ClassJoinRequestStatus,
} from '../../../src/entities/classes/class-join-request.entity';
import { Student } from '../../../src/entities/users/student.entity';
import { Class } from '../../../src/entities/classes/class.entity';

export function makeTestClassJoinRequests(
    em: EntityManager<IDatabaseDriver<Connection>>,
    students: Array<Student>,
    classes: Array<Class>
): Array<ClassJoinRequest> {
    const classJoinRequest01 = em.create(ClassJoinRequest, {
        requester: students[4],
        class: classes[1],
        status: ClassJoinRequestStatus.Open,
    });

    const classJoinRequest02 = em.create(ClassJoinRequest, {
        requester: students[2],
        class: classes[1],
        status: ClassJoinRequestStatus.Open,
    });

    const classJoinRequest03 = em.create(ClassJoinRequest, {
        requester: students[4],
        class: classes[2],
        status: ClassJoinRequestStatus.Open,
    });

    const classJoinRequest04 = em.create(ClassJoinRequest, {
        requester: students[3],
        class: classes[2],
        status: ClassJoinRequestStatus.Open,
    });

    return [
        classJoinRequest01,
        classJoinRequest02,
        classJoinRequest03,
        classJoinRequest04,
    ];
}
