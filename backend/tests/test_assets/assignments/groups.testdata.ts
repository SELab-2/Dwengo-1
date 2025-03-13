import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Group } from '../../../src/entities/assignments/group.entity';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { Student } from '../../../src/entities/users/student.entity';

export function makeTestGroups(
    em: EntityManager<IDatabaseDriver<Connection>>,
    students: Array<Student>,
    assignments: Array<Assignment>
): Array<Group> {
    const group01 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 1,
        members: students.slice(0, 2),
    });

    const group02 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 2,
        members: students.slice(2, 4),
    });

    const group03 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 3,
        members: students.slice(4, 6),
    });

    const group04 = em.create(Group, {
        assignment: assignments[1],
        groupNumber: 4,
        members: students.slice(3, 4),
    });

    return [group01, group02, group03, group04];
}
