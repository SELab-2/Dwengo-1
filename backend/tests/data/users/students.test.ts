import { setupTestApp } from '../../setup-tests.js';
import { describe, it, expect, beforeAll } from 'vitest';
import { StudentRepository } from '../../../src/data/users/student-repository.js';
import { getStudentRepository } from '../../../src/data/repositories.js';
import { getNameOfJSDocTypedef } from 'typescript';
import { getNoordkaap } from '../../test_assets/users/students.testdata.js';

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
        const expectation = getNoordkaap();
        const student = await studentRepository.findByUsername(expectation.username);

        expect(student).toBeTruthy();
        expect(student?.firstName).toBe(expectation.firstName);
        expect(student?.lastName).toBe(expectation.lastName);
    });

    it('should return the queried student after he was added', async () => {
        await studentRepository.insert(studentRepository.create({ username, firstName, lastName }));

        const retrievedStudent = await studentRepository.findByUsername(username);
        expect(retrievedStudent).toBeTruthy();
        expect(retrievedStudent?.firstName).toBe(firstName);
        expect(retrievedStudent?.lastName).toBe(lastName);
    });

    it('should no longer return the queried student after he was removed again', async () => {
        await studentRepository.deleteByUsername(username);

        const retrievedStudent = await studentRepository.findByUsername(username);
        expect(retrievedStudent).toBeNull();
    });
});
