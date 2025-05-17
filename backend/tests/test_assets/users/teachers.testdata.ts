import { Teacher } from '../../../src/entities/users/teacher.entity';
import { EntityManager } from '@mikro-orm/core';

export function makeTestTeachers(em: EntityManager): Teacher[] {
    teacher01 = em.create(Teacher, {
        username: 'FooFighters',
        firstName: 'Dave',
        lastName: 'Grohl',
    });

    teacher02 = em.create(Teacher, {
        username: 'LimpBizkit',
        firstName: 'Fred',
        lastName: 'Durst',
    });

    teacher03 = em.create(Teacher, {
        username: 'Staind',
        firstName: 'Aaron',
        lastName: 'Lewis',
    });

    // Should not be used, gets deleted in a unit test
    teacher04 = em.create(Teacher, {
        username: 'ZesdeMetaal',
        firstName: 'Wannes',
        lastName: 'Cappelle',
    });

    // Makes sure when logged in as testleerkracht1, there exists a corresponding user
    testleerkracht1 = em.create(Teacher, {
        username: 'testleerkracht1',
        firstName: 'David',
        lastName: 'Bowie',
    });

    return [teacher01, teacher02, teacher03, teacher04, testleerkracht1];
}

let teacher01: Teacher;
let teacher02: Teacher;
let teacher03: Teacher;
let teacher04: Teacher;
let testleerkracht1: Teacher;

export function getFooFighters(): Teacher {
    return teacher01;
}

export function getLimpBizkit(): Teacher {
    return teacher02;
}

export function getStaind(): Teacher {
    return teacher03;
}

export function getZesdeMetaal(): Teacher {
    return teacher04;
}

export function getTestleerkracht1(): Teacher {
    return testleerkracht1;
}
