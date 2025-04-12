import { EntityManager } from '@mikro-orm/core';
import { Student } from '../../../src/entities/users/student.entity';
import {StudentDTO} from "@dwengo-1/common/interfaces/student";

export const TEST_STUDENT_LIST: StudentDTO[] = [
    { username: 'Noordkaap', id: 'Noordkaap', firstName: 'Stijn', lastName: 'Meuris' },
    { id: 'DireStraits', username: 'DireStraits', firstName: 'Mark', lastName: 'Knopfler' },
    { id: 'Tool', username: 'Tool', firstName: 'Maynard', lastName: 'Keenan' },
    { id: 'SmashingPumpkins', username: 'SmashingPumpkins', firstName: 'Billy', lastName: 'Corgan' },
    { id: 'PinkFloyd', username: 'PinkFloyd', firstName: 'David', lastName: 'Gilmoure' },
    { id: 'TheDoors', username: 'TheDoors', firstName: 'Jim', lastName: 'Morisson' },
    // ⚠️ Deze mag niet gebruikt worden in elke test!
    { id: 'Nirvana', username: 'Nirvana', firstName: 'Kurt', lastName: 'Cobain' },
    // Makes sure when logged in as leerling1, there exists a corresponding user
    { id: 'testleerling1', username: 'testleerling1', firstName: 'Gerald', lastName: 'Schmittinger' },
];

export function makeTestStudents(em: EntityManager): Student[] {
    return TEST_STUDENT_LIST.map((data) => em.create(Student, data));
}
