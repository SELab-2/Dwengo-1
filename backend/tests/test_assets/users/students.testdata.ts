import { EntityManager } from '@mikro-orm/core';
import { Student } from '../../../src/entities/users/student.entity';

let student01: Student;
let student02: Student;
let student03: Student;
let student04: Student;
let student05: Student;
let student06: Student;
let student07: Student;
let student08: Student;

export let TEST_STUDENT_LIST: Student[];

export function makeTestStudents(em: EntityManager): Student[] {
    student01 = em.create(Student, {
        username: 'Noordkaap',
        firstName: 'Stijn',
        lastName: 'Meuris',
    });

    student02 = em.create(Student, {
        username: 'DireStraits',
        firstName: 'Mark',
        lastName: 'Knopfler',
    });

    student03 = em.create(Student, {
        username: 'Tool',
        firstName: 'Maynard',
        lastName: 'Keenan',
    });

    student04 = em.create(Student, {
        username: 'SmashingPumpkins',
        firstName: 'Billy',
        lastName: 'Corgan',
    });

    student05 = em.create(Student, {
        username: 'PinkFloyd',
        firstName: 'David',
        lastName: 'Gilmoure',
    });

    student06 = em.create(Student, {
        username: 'TheDoors',
        firstName: 'Jim',
        lastName: 'Morisson',
    });

    // ⚠️ Deze mag niet gebruikt worden in elke test!
    student07 = em.create(Student, {
        username: 'Nirvana',
        firstName: 'Kurt',
        lastName: 'Cobain',
    });

    // Makes sure when logged in as leerling1, there exists a corresponding user
    student08 = em.create(Student, {
        username: 'testleerling1',
        firstName: 'Gerald',
        lastName: 'Schmittinger',
    });

    TEST_STUDENT_LIST = [student01, student02, student03, student04, student05, student06, student07, student08];
    return TEST_STUDENT_LIST;
}
