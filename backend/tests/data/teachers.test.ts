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

    it('should not return a teacher because username does not exist', async() => {
        const student = await TeacherRepository.findByUsername('test');

        expect(student).toBeNull();
    });

    it('should return teacher from the datbase', async() => {
        const student = await TeacherRepository.findByUsername('Tool');

        expect(student).toBeTruthy();
        expect(student?.firstName).toBe('Maynard');
        expect(student?.lastName).toBe('Keenan');
    })

    it('should return the queried teacher after he was added', async () => {
        await TeacherRepository.insert(
            new Teacher(username, firstName, lastName)
        );

        const retrievedStudent =
            await TeacherRepository.findByUsername(username);
        expect(retrievedStudent).toBeTruthy();
        expect(retrievedStudent?.firstName).toBe(firstName);
        expect(retrievedStudent?.lastName).toBe(lastName);
    });

    it('should no longer return the queried student after he was removed again', async () => {
        await TeacherRepository.deleteByUsername(username);

        const retrievedStudent =
            await TeacherRepository.findByUsername(username);
        expect(retrievedStudent).toBeNull();
    });
});
