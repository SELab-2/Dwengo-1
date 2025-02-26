import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Assignment } from '../../entities/assignments/assignment.entity.js';
import { Class } from '../../entities/classes/class.entity.js';

export class AssignmentRepository extends DwengoEntityRepository<Assignment> {
    public findByClassAndId(
        within: Class,
        id: number
    ): Promise<Assignment | null> {
        return this.findOne({ within: within, id: id });
    }
    public findAllAssignmentsInClass(within: Class): Promise<Assignment[]> {
        return this.findAll({ where: { within: within } });
    }
    public deleteByClassAndId(within: Class, id: number): Promise<void> {
        return this.deleteWhere({ within: within, id: id });
    }
}
