import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { Student } from '../users/student.entity.js';
import { Class } from './class.entity.js';
import { ClassJoinRequestRepository } from '../../data/classes/class-join-request-repository.js';

@Entity({ repository: () => ClassJoinRequestRepository })
export class ClassJoinRequest {
    @ManyToOne({
        entity: () => Student,
        primary: true,
    })
    requester!: Student;

    @ManyToOne({
        entity: () => Class,
        primary: true,
    })
    class!: Class;

    @Enum(() => ClassJoinRequestStatus)
    status!: ClassJoinRequestStatus;
}

export enum ClassJoinRequestStatus {
    Open = 'open',
    Accepted = 'accepted',
    Declined = 'declined',
}
