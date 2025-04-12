import { Teacher } from '../../../src/entities/users/teacher.entity';
import { EntityManager } from '@mikro-orm/core';
import {TeacherDTO} from "@dwengo-1/common/interfaces/teacher";

export const TEST_TEACHER_LIST: TeacherDTO[] = [
    { id: 'FooFighters', username: 'FooFighters', firstName: 'Dave', lastName: 'Grohl',},
    { id: 'LimpBizkit', username: 'LimpBizkit', firstName: 'Fred', lastName: 'Durst',},
    { id: 'Staind', username: 'Staind', firstName: 'Aaron', lastName: 'Lewis',},
    // Should not be used, gets deleted in a unit test
    { id: 'ZesdeMetaal', username: 'ZesdeMetaal', firstName: 'Wannes', lastName: 'Cappelle',},
    // Makes sure when logged in as testleerkracht1, there exists a corresponding user
    { id: 'testleerkracht1', username: 'testleerkracht1', firstName: 'Bob', lastName: 'Dylan', }
];

export function makeTestTeachers(em: EntityManager): Teacher[] {
    return TEST_TEACHER_LIST.map((data) => em.create(Teacher, data));
}
