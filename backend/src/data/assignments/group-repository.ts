import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Group } from '../../entities/assignments/group.entity.js';
import { Assignment } from '../../entities/assignments/assignment.entity.js';
import { Student } from '../../entities/users/student.entity.js';

export class GroupRepository extends DwengoEntityRepository<Group> {
    public async findByAssignmentAndGroupNumber(assignment: Assignment, groupNumber: number): Promise<Group | null> {
        return this.findOne(
            {
                assignment: assignment,
                groupNumber: groupNumber,
            },
            { populate: ['members'] }
        );
    }
    public async findAllGroupsForAssignment(assignment: Assignment): Promise<Group[]> {
        return this.findAll({
            where: { assignment: assignment },
            populate: ['members'],
        });
    }
    public async findAllGroupsWithStudent(student: Student): Promise<Group[]> {
        return this.find({ members: student }, { populate: ['members'] });
    }
    public async deleteByAssignmentAndGroupNumber(assignment: Assignment, groupNumber: number): Promise<void> {
        return this.deleteWhere({
            assignment: assignment,
            groupNumber: groupNumber,
        });
    }
    public async deleteAllByAssignment(assignment: Assignment): Promise<void> {
        return this.deleteAllWhere({
            assignment: assignment,
        });
    }
}
