import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Group } from '../../entities/assignments/group.entity.js';
import { Assignment } from '../../entities/assignments/assignment.entity.js';

export class GroupRepository extends DwengoEntityRepository<Group> {
    public findByAssignmentAndGroupNumber(assignment: Assignment, groupNumber: number): Promise<Group | null> {
        return this.findOne({
            assignment: assignment,
            groupNumber: groupNumber,
        });
    }
    public findAllGroupsForAssignment(assignment: Assignment): Promise<Group[]> {
        return this.findAll({ where: { assignment: assignment } });
    }
    public deleteByAssignmentAndGroupNumber(assignment: Assignment, groupNumber: number) {
        return this.deleteWhere({
            assignment: assignment,
            groupNumber: groupNumber,
        });
    }
}
