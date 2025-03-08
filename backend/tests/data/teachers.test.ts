import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll } from 'vitest';
import { TeacherRepository } from '../../src/data/users/teacher-repository.js';
import { Teacher } from '../../src/entities/users/teacher.entity.js';
import { getTeacherRepository } from '../../src/data/repositories.js';

const username = 'testteacher';
const firstName = 'John';
const lastName = 'Doe';
describe('TeacherRepository', () => {
    let TeacherRepository: TeacherRepository;

    beforeAll(async () => {
        await setupTestApp();
        TeacherRepository = getTeacherRepository();
    });

    it('should not return a teacher because username does not exist', async () => {
        const teacher = await TeacherRepository.findByUsername('test');

        expect(teacher).toBeNull();
    });

    it('should return teacher from the datbase', async () => {
        const teacher = await TeacherRepository.findByUsername('FooFighters');

        expect(teacher).toBeTruthy();
        expect(teacher?.firstName).toBe('Dave');
        expect(teacher?.lastName).toBe('Grohl');
    });

    it('should return the queried teacher after he was added', async () => {
        await TeacherRepository.insert(
            new Teacher(username, firstName, lastName)
        );

        const retrievedTeacher =
            await TeacherRepository.findByUsername(username);
        expect(retrievedTeacher).toBeTruthy();
        expect(retrievedTeacher?.firstName).toBe(firstName);
        expect(retrievedTeacher?.lastName).toBe(lastName);
    });

    it('should no longer return the queried teacher after he was removed again', async () => {
        await TeacherRepository.deleteByUsername('ZesdeMetaal');

        const retrievedTeacher =
            await TeacherRepository.findByUsername('ZesdeMetaal');
        expect(retrievedTeacher).toBeNull();
    });
});
