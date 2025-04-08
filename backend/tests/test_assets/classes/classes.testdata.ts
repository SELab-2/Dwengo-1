import { EntityManager } from '@mikro-orm/core';
import { Class } from '../../../src/entities/classes/class.entity';
import { Student } from '../../../src/entities/users/student.entity';
import { Teacher } from '../../../src/entities/users/teacher.entity';

export function makeTestClasses(em: EntityManager, students: Student[], teachers: Teacher[]): Class[] {
    const studentsClass01 = students.slice(0, 8);
    const teacherClass01: Teacher[] = teachers.slice(4, 5);

    const class01 = em.create(Class, {
        classId: '8764b861-90a6-42e5-9732-c0d9eb2f55f9',
        displayName: 'class01',
        teachers: teacherClass01,
        students: studentsClass01,
    });

    const studentsClass02: Student[] = students.slice(0, 2).concat(students.slice(3, 4));
    const teacherClass02: Teacher[] = teachers.slice(1, 2);

    const class02 = em.create(Class, {
        classId: '34d484a1-295f-4e9f-bfdc-3e7a23d86a89',
        displayName: 'class02',
        teachers: teacherClass02,
        students: studentsClass02,
    });

    const studentsClass03: Student[] = students.slice(1, 4);
    const teacherClass03: Teacher[] = teachers.slice(2, 3);

    const class03 = em.create(Class, {
        classId: '80dcc3e0-1811-4091-9361-42c0eee91cfa',
        displayName: 'class03',
        teachers: teacherClass03,
        students: studentsClass03,
    });

    const studentsClass04: Student[] = students.slice(0, 2);
    const teacherClass04: Teacher[] = teachers.slice(2, 3);

    const class04 = em.create(Class, {
        classId: '33d03536-83b8-4880-9982-9bbf2f908ddf',
        displayName: 'class04',
        teachers: teacherClass04,
        students: studentsClass04,
    });

    return [class01, class02, class03, class04];
}
