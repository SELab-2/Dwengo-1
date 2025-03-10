import { setupTestApp } from '../../setup-tests.js';
import { Student } from '../../../src/entities/users/student.entity.js';
import { describe, it, expect, beforeAll } from 'vitest';
import { StudentRepository } from '../../../src/data/users/student-repository.js';
import { getStudentRepository } from '../../../src/data/repositories.js';

const username = 'teststudent';
const firstName = 'John';
const lastName = 'Doe';
describe('StudentRepository', () => {
    let studentRepository: StudentRepository;

    beforeAll(async () => {
        await setupTestApp();
        studentRepository = getStudentRepository();
    });

    it('should not return a student because username does not exist', async () => {
        const student = await studentRepository.findByUsername('test');

        expect(student).toBeNull();
    });

    it('should return student from the datbase', async () => {
        const student = await studentRepository.findByUsername('Noordkaap');

        expect(student).toBeTruthy();
        expect(student?.firstName).toBe('Stijn');
        expect(student?.lastName).toBe('Meuris');
    });

    it('should return the queried student after he was added', async () => {
        await studentRepository.insert(
            new Student(username, firstName, lastName)
        );

        const retrievedStudent =
            await studentRepository.findByUsername(username);
        expect(retrievedStudent).toBeTruthy();
        expect(retrievedStudent?.firstName).toBe(firstName);
        expect(retrievedStudent?.lastName).toBe(lastName);
    });

    it('should no longer return the queried student after he was removed again', async () => {
        await studentRepository.deleteByUsername('Nirvana');

        const retrievedStudent =
            await studentRepository.findByUsername('Nirvana');
        expect(retrievedStudent).toBeNull();
    });
});
