import { describe, it, expect, beforeAll } from 'vitest';
import { TeacherRepository } from '../../../src/data/users/teacher-repository';
import { setupTestApp } from '../../setup-tests';
import { getTeacherRepository } from '../../../src/data/repositories';
import { getFooFighters } from '../../test_assets/users/teachers.testdata';

const username = 'testteacher';
const firstName = 'John';
const lastName = 'Doe';
describe('TeacherRepository', () => {
    let teacherRepository: TeacherRepository;

    beforeAll(async () => {
        await setupTestApp();
        teacherRepository = getTeacherRepository();
    });

    it('should not return a teacher because username does not exist', async () => {
        const teacher = await teacherRepository.findByUsername('test');

        expect(teacher).toBeNull();
    });

    it('should return teacher from the datbase', async () => {
        const expected = getFooFighters();
        const teacher = await teacherRepository.findByUsername(expected.username);

        expect(teacher).toBeTruthy();
        expect(teacher?.firstName).toBe(expected.firstName);
        expect(teacher?.lastName).toBe(expected.lastName);
    });

    it('should return the queried teacher after he was added', async () => {
        await teacherRepository.insert(teacherRepository.create({ username, firstName, lastName }));

        const retrievedTeacher = await teacherRepository.findByUsername(username);
        expect(retrievedTeacher).toBeTruthy();
        expect(retrievedTeacher?.firstName).toBe(firstName);
        expect(retrievedTeacher?.lastName).toBe(lastName);
    });

    it('should no longer return the queried teacher after he was removed again', async () => {
        await teacherRepository.deleteByUsername(username);

        const retrievedTeacher = await teacherRepository.findByUsername(username);
        expect(retrievedTeacher).toBeNull();
    });
});
