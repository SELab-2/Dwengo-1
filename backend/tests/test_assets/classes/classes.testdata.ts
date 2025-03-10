import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Class } from '../../../src/entities/classes/class.entity';
import { Student } from '../../../src/entities/users/student.entity';
import { Teacher } from '../../../src/entities/users/teacher.entity';

export function makeTestClasses(
    em: EntityManager<IDatabaseDriver<Connection>>,
    students: Array<Student>,
    teachers: Array<Teacher>
): Array<Class> {
    const studentsClass01 = students.slice(0, 7);
    const teacherClass01: Array<Teacher> = teachers.slice(0, 1);

    const class01 = em.create(Class, {
        classId: 'id01',
        displayName: 'class01',
        teachers: teacherClass01,
        students: studentsClass01,
    });

    const studentsClass02: Array<Student> = students
        .slice(0, 2)
        .concat(students.slice(3, 4));
    const teacherClass02: Array<Teacher> = teachers.slice(1, 2);

    const class02 = em.create(Class, {
        classId: 'id02',
        displayName: 'class02',
        teachers: teacherClass02,
        students: studentsClass02,
    });

    const studentsClass03: Array<Student> = students.slice(1, 4);
    const teacherClass03: Array<Teacher> = teachers.slice(2, 3);

    const class03 = em.create(Class, {
        classId: 'id03',
        displayName: 'class03',
        teachers: teacherClass03,
        students: studentsClass03,
    });

    const studentsClass04: Array<Student> = students.slice(0, 2);
    const teacherClass04: Array<Teacher> = teachers.slice(2, 3);

    const class04 = em.create(Class, {
        classId: 'id04',
        displayName: 'class04',
        teachers: teacherClass04,
        students: studentsClass04,
    });

    return [class01, class02, class03, class04];
}
