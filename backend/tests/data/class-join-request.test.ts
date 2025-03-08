import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../setup-tests';
import { ClassJoinRequestRepository } from '../../src/data/classes/class-join-request-repository';
import {
    getClassJoinRequestRepository,
    getClassRepository,
    getStudentRepository,
} from '../../src/data/repositories';
import { StudentRepository } from '../../src/data/users/student-repository';
import { Class } from '../../src/entities/classes/class.entity';
import { ClassRepository } from '../../src/data/classes/class-repository';
import { Student } from '../../src/entities/users/student.entity';

describe('ClassJoinRequestRepository', () => {
    let ClassJoinRequestRepository: ClassJoinRequestRepository;
    let StudentRepository: StudentRepository;
    let ClassRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        ClassJoinRequestRepository = getClassJoinRequestRepository();
        StudentRepository = getStudentRepository();
        ClassRepository = getClassRepository();
    });

    it('should list all requests from student to join classes', async () => {
        const student = await StudentRepository.findByUsername('PinkFloyd');
        const requests = await ClassJoinRequestRepository.findAllRequestsBy(
            student!
        );

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(2);
    });

    it('should list all requests to a single class', async () => {
        const class_ = await ClassRepository.findById('id02');
        const requests = await ClassJoinRequestRepository.findAllOpenRequestsTo(
            class_!
        );

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(2);
    });

    it('should not find a removed request', async () => {
        const student =
            await StudentRepository.findByUsername('SmashingPumpkins');
        const class_ = await ClassRepository.findById('id03');
        await ClassJoinRequestRepository.deleteBy(student!, class_!);

        const request = await ClassJoinRequestRepository.findAllRequestsBy(
            student!
        );

        expect(request).toHaveLength(0);
    });
});
