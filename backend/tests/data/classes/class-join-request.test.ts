import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { ClassJoinRequestRepository } from '../../../src/data/classes/class-join-request-repository';
import { getClassJoinRequestRepository, getClassRepository, getStudentRepository } from '../../../src/data/repositories';
import { StudentRepository } from '../../../src/data/users/student-repository';
import { ClassRepository } from '../../../src/data/classes/class-repository';
import {getClass02, getClass03} from "../../test_assets/classes/classes.testdata";

describe('ClassJoinRequestRepository', () => {
    let classJoinRequestRepository: ClassJoinRequestRepository;
    let studentRepository: StudentRepository;
    let cassRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        classJoinRequestRepository = getClassJoinRequestRepository();
        studentRepository = getStudentRepository();
        cassRepository = getClassRepository();
    });

    it('should list all requests from student to join classes', async () => {
        const student = await studentRepository.findByUsername('PinkFloyd');
        const requests = await classJoinRequestRepository.findAllRequestsBy(student!);

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(2);
    });

    it('should list all requests to a single class', async () => {
        const class_ = await cassRepository.findById(getClass02().classId);
        const requests = await classJoinRequestRepository.findAllOpenRequestsTo(class_!);

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(2);
    });

    it('should not find a removed request', async () => {
        const student = await studentRepository.findByUsername('SmashingPumpkins');
        const class_ = await cassRepository.findById(getClass03().classId);
        await classJoinRequestRepository.deleteBy(student!, class_!);

        const request = await classJoinRequestRepository.findAllRequestsBy(student!);

        expect(request).toHaveLength(0);
    });
});
