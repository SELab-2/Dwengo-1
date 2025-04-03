import { Teacher } from '../../../src/entities/users/teacher.entity';
import { EntityManager } from '@mikro-orm/core';

export function makeTestTeachers(em: EntityManager): Teacher[] {
    const teacher01 = em.create(Teacher, {
        username: 'FooFighters',
        firstName: 'Dave',
        lastName: 'Grohl',
    });

    const teacher02 = em.create(Teacher, {
        username: 'LimpBizkit',
        firstName: 'Fred',
        lastName: 'Durst',
    });

    const teacher03 = em.create(Teacher, {
        username: 'Staind',
        firstName: 'Aaron',
        lastName: 'Lewis',
    });

    // Should not be used, gets deleted in a unit test
    const teacher04 = em.create(Teacher, {
        username: 'ZesdeMetaal',
        firstName: 'Wannes',
        lastName: 'Cappelle',
    });

    return [teacher01, teacher02, teacher03, teacher04];
}
