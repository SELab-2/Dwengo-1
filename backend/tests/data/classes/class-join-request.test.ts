import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { ClassJoinRequestRepository } from '../../../src/data/classes/class-join-request-repository';
import { getClassJoinRequestRepository } from '../../../src/data/repositories';
import { getPinkFloyd, getSmashingPumpkins } from '../../test_assets/users/students.testdata';
import { getClass02, getClass03 } from '../../test_assets/classes/classes.testdata';
import { getClassJoinRequest01, getClassJoinRequest02, getClassJoinRequest03 } from '../../test_assets/classes/class-join-requests.testdata';

describe('ClassJoinRequestRepository', () => {
    let classJoinRequestRepository: ClassJoinRequestRepository;

    beforeAll(async () => {
        await setupTestApp();
        classJoinRequestRepository = getClassJoinRequestRepository();
    });

    it('should list all requests from student to join classes', async () => {
        const studentUsed = getPinkFloyd();
        const jr1 = getClassJoinRequest01();
        const jr2 = getClassJoinRequest03();
        const requests = await classJoinRequestRepository.findAllRequestsBy(studentUsed);

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(2);
        expect(requests[0].class.classId!).toBeOneOf([jr1.class.classId!, jr2.class.classId!]);
        expect(requests[1].class.classId!).toBeOneOf([jr1.class.classId!, jr2.class.classId!]);
    });

    it('should list all requests to a single class', async () => {
        const class_ = getClass02();
        const jr1 = getClassJoinRequest01();
        const jr2 = getClassJoinRequest02();
        const requests = await classJoinRequestRepository.findAllOpenRequestsTo(class_);

        expect(requests).toBeTruthy();
        expect(requests).toHaveLength(2);
        expect(requests[0].class.classId).toBeOneOf([jr1.class.classId, jr2.class.classId]);
        expect(requests[1].class.classId).toBeOneOf([jr1.class.classId, jr2.class.classId]);
    });

    it('should not find a removed request', async () => {
        const studentUsed = getSmashingPumpkins();
        const class_ = getClass03();
        await classJoinRequestRepository.deleteBy(studentUsed, class_);

        const request = await classJoinRequestRepository.findAllRequestsBy(studentUsed);

        expect(request).toHaveLength(0);
    });
});
