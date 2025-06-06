import { EntityManager } from '@mikro-orm/core';
import { Student } from '../../../src/entities/users/student.entity';

// 🔓 Ruwe testdata array — herbruikbaar in assertions
export const TEST_STUDENTS = [
    { username: 'Noordkaap', firstName: 'Stijn', lastName: 'Meuris' },
    { username: 'DireStraits', firstName: 'Mark', lastName: 'Knopfler' },
    { username: 'Tool', firstName: 'Maynard', lastName: 'Keenan' },
    { username: 'SmashingPumpkins', firstName: 'Billy', lastName: 'Corgan' },
    { username: 'PinkFloyd', firstName: 'David', lastName: 'Gilmoure' },
    { username: 'TheDoors', firstName: 'Jim', lastName: 'Morisson' },
    { username: 'Nirvana', firstName: 'Kurt', lastName: 'Cobain' },
    // Makes sure when logged in as leerling1, there exists a corresponding user
    { username: 'testleerling1', firstName: 'Gerald', lastName: 'Schmittinger' },
];

let testStudents: Student[];

// 🏗️ Functie die ORM entities maakt uit de data array
export function makeTestStudents(em: EntityManager): Student[] {
    testStudents = TEST_STUDENTS.map((data) => em.create(Student, data));
    return testStudents;
}

export function getTestleerling1(): Student {
    return testStudents.find((it) => it.username === 'testleerling1')!;
}

export function getNoordkaap(): Student {
    return testStudents.find((it) => it.username === 'Noordkaap')!;
}

export function getDireStraits(): Student {
    return testStudents.find((it) => it.username === 'DireStraits')!;
}

export function getTool(): Student {
    return testStudents.find((it) => it.username === 'Tool')!;
}

export function getSmashingPumpkins(): Student {
    return testStudents.find((it) => it.username === 'SmashingPumpkins')!;
}

export function getPinkFloyd(): Student {
    return testStudents.find((it) => it.username === 'PinkFloyd')!;
}

export function getTheDoors(): Student {
    return testStudents.find((it) => it.username === 'TheDoors')!;
}

export function getNirvana(): Student {
    return testStudents.find((it) => it.username === 'Nirvana')!;
}
