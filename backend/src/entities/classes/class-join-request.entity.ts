import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { Student } from '../users/student.entity';
import { Class } from './class.entity';

@Entity()
export class ClassJoinRequest {
    @ManyToOne({ entity: () => {return Student}, primary: true })
    requester!: Student;

    @ManyToOne({ entity: () => {return Class}, primary: true })
    class!: Class;

    @Enum(() => {return ClassJoinRequestStatus})
    status!: ClassJoinRequestStatus;
}

export enum ClassJoinRequestStatus {
    Open = 'open',
    Accepted = 'accepted',
    Declined = 'declined',
}
