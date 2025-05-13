import { EntityManager } from '@mikro-orm/core';
import { Class } from '../../../src/entities/classes/class.entity';
import { Student } from '../../../src/entities/users/student.entity';
import { Teacher } from '../../../src/entities/users/teacher.entity';
import { getLimpBizkit, getStaind, getTestleerkracht1 } from '../users/teachers.testdata';
import { getDireStraits, getNoordkaap, getSmashingPumpkins, getTestleerling1, getTool } from '../users/students.testdata';

export function makeTestClasses(em: EntityManager): Class[] {
    const studentsClass01 = [getTestleerling1()];
    const teacherClass01: Teacher[] = [getTestleerkracht1()];

    class01 = em.create(Class, {
        classId: 'X2J9QT', // 8764b861-90a6-42e5-9732-c0d9eb2f55f9
        displayName: 'class01',
        teachers: teacherClass01,
        students: studentsClass01,
    });

    const studentsClass02: Student[] = [getNoordkaap(), getDireStraits(), getSmashingPumpkins()];
    const teacherClass02: Teacher[] = [getLimpBizkit()];

    class02 = em.create(Class, {
        classId: '7KLPMA', // 34d484a1-295f-4e9f-bfdc-3e7a23d86a89
        displayName: 'class02',
        teachers: teacherClass02,
        students: studentsClass02,
    });

    const studentsClass03: Student[] = [getDireStraits(), getTool(), getSmashingPumpkins()];
    const teacherClass03: Teacher[] = [getStaind()];

    class03 = em.create(Class, {
        classId: 'R0D3UZ', // 80dcc3e0-1811-4091-9361-42c0eee91cfa
        displayName: 'class03',
        teachers: teacherClass03,
        students: studentsClass03,
    });

    const studentsClass04: Student[] = [getNoordkaap(), getDireStraits()];
    const teacherClass04: Teacher[] = [getStaind()];

    // Gets deleted in test
    class04 = em.create(Class, {
        classId: 'Q8N5YC', // 33d03536-83b8-4880-9982-9bbf2f908ddf
        displayName: 'class04',
        teachers: teacherClass04,
        students: studentsClass04,
    });

    classWithTestleerlingAndTestleerkracht = em.create(Class, {
        classId: 'ZAV71B', // Was a75298b5-18aa-471d-8eeb-5d77eb989393
        displayName: 'Testklasse',
        teachers: [getTestleerkracht1()],
        students: [getTestleerling1()],
    });

    return [class01, class02, class03, class04, classWithTestleerlingAndTestleerkracht];
}

let class01: Class;
let class02: Class;
let class03: Class;
let class04: Class;
let classWithTestleerlingAndTestleerkracht: Class;

export function getClass01(): Class {
    return class01;
}

export function getClass02(): Class {
    return class02;
}

export function getClass03(): Class {
    return class03;
}

export function getClass04(): Class {
    return class04;
}

export function getClassWithTestleerlingAndTestleerkracht(): Class {
    return classWithTestleerlingAndTestleerkracht;
}
