import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { TeacherInvitation } from '../../../src/entities/classes/teacher-invitation.entity';
import { Teacher } from '../../../src/entities/users/teacher.entity';
import { Class } from '../../../src/entities/classes/class.entity';

export function makeTestTeacherInvitations(
    em: EntityManager<IDatabaseDriver<Connection>>,
    teachers: Array<Teacher>,
    classes: Array<Class>
): Array<TeacherInvitation> {
    const teacherInvitation01 = em.create(TeacherInvitation, {
        sender: teachers[1],
        receiver: teachers[0],
        class: classes[1],
    });

    const teacherInvitation02 = em.create(TeacherInvitation, {
        sender: teachers[1],
        receiver: teachers[2],
        class: classes[1],
    });

    const teacherInvitation03 = em.create(TeacherInvitation, {
        sender: teachers[2],
        receiver: teachers[0],
        class: classes[2],
    });

    const teacherInvitation04 = em.create(TeacherInvitation, {
        sender: teachers[0],
        receiver: teachers[1],
        class: classes[0],
    });

    return [teacherInvitation01, teacherInvitation02, teacherInvitation03, teacherInvitation04];
}
