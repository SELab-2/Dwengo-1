import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Student } from '../../../src/entities/users/student.entity';

export function makeTestStudents(
    em: EntityManager<IDatabaseDriver<Connection>>
): Array<Student> {
    const student01 = em.create(Student, {
        username: 'Noordkaap',
        firstName: 'Stijn',
        lastName: 'Meuris',
    });

    const student02 = em.create(Student, {
        username: 'DireStraits',
        firstName: 'Mark',
        lastName: 'Knopfler',
    });

    const student03 = em.create(Student, {
        username: 'Tool',
        firstName: 'Maynard',
        lastName: 'Keenan',
    });

    const student04 = em.create(Student, {
        username: 'SmashingPumpkins',
        firstName: 'Billy',
        lastName: 'Corgan',
    });

    const student05 = em.create(Student, {
        username: 'PinkFloyd',
        firstName: 'David',
        lastName: 'Gilmoure',
    });

    const student06 = em.create(Student, {
        username: 'TheDoors',
        firstName: 'Jim',
        lastName: 'Morisson',
    });

    // do not use for any tests, gets deleted in a unit test
    const student07 = em.create(Student, {
        username: 'Nirvana',
        firstName: 'Kurt',
        lastName: 'Cobain',
    });

    return [
        student01,
        student02,
        student03,
        student04,
        student05,
        student06,
        student07,
    ];
}
