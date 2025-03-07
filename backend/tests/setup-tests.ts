import { Student } from '../src/entities/users/student.entity.js';
import { forkEntityManager, initORM } from '../src/orm.js';
import dotenv from 'dotenv';

export async function setupTestApp() {
    dotenv.config({ path: '.env.test' });
    await initORM(true);

    const em = forkEntityManager();

    const user01 = em.create(Student, {username: 'Noordkaap', firstName: 'Stijn', lastName: 'Meuris'})
    const user02 = em.create(Student, {username: 'DireStraits', firstName: 'Mark', lastName: 'Knopfler'})
    const user03 = em.create(Student, {username: 'SmashingPumpkins', firstName: 'Billy', lastName: 'Corgan'})

    await em.persistAndFlush([user01, user02, user03]);
}
