import {Entity, Enum, ManyToOne} from '@mikro-orm/core';
import { Teacher } from '../users/teacher.entity.js';
import { Class } from './class.entity.js';
import { TeacherInvitationRepository } from '../../data/classes/teacher-invitation-repository.js';
import {ClassStatus} from "@dwengo-1/common/util/class-join-request";

/**
 * Invitation of a teacher into a class (in order to teach it).
 */
@Entity({ repository: () => TeacherInvitationRepository })
export class TeacherInvitation {
    @ManyToOne({
        entity: () => Teacher,
        primary: true,
    })
    sender!: Teacher;

    @ManyToOne({
        entity: () => Teacher,
        primary: true,
    })
    receiver!: Teacher;

    @ManyToOne({
        entity: () => Class,
        primary: true,
    })
    class!: Class;

    @Enum(() => ClassStatus)
    status!: ClassStatus;
}
