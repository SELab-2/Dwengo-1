import { Student } from '../src/entities/users/student.entity.js';
import { Teacher } from '../src/entities/users/teacher.entity.js';
import { forkEntityManager, initORM } from '../src/orm.js';
import dotenv from 'dotenv';

export async function setupTestApp() {
    dotenv.config({ path: '.env.test' });
    await initORM(true);

    const em = forkEntityManager();

    const student01 = em.create(Student, {username: 'Noordkaap', firstName: 'Stijn', lastName: 'Meuris'});
    const student02 = em.create(Student, {username: 'DireStraits', firstName: 'Mark', lastName: 'Knopfler'});
    const student03 = em.create(Student, {username: 'SmashingPumpkins', firstName: 'Billy', lastName: 'Corgan'});

    await em.persistAndFlush([student01, student02, student03]);

    const teacher01 = em.create(Teacher, {username: 'Tool', firstName: 'Maynard', lastName: 'Keenan'});
    const teacher02 = em.create(Teacher, { username: 'Staind', firstName: 'Aaron', lastName: 'Lewis'});
    const teacher03 = em.create(Teacher, { username: 'TheDoors', firstName: 'Jim', lastName: 'Morrison'});

    await em.persistAndFlush([teacher01, teacher02, teacher03]);
}
