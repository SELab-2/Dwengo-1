import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Assignment } from '../../entities/assignments/assignment.entity.js';
import { Class } from '../../entities/classes/class.entity.js';

export class AssignmentRepository extends DwengoEntityRepository<Assignment> {
    public async findByClassAndId(within: Class, id: number): Promise<Assignment | null> {
        return this.findOne({ within: within, id: id }, { populate: ['groups', 'groups.members'] });
    }
    public async findByClassIdAndAssignmentId(withinClass: string, id: number): Promise<Assignment | null> {
        return this.findOne({ within: { classId: withinClass }, id: id }, { populate: ['groups', 'groups.members'] });
    }
    public async findAllByResponsibleTeacher(teacherUsername: string): Promise<Assignment[]> {
        return this.findAll({
            where: {
                within: {
                    teachers: {
                        $some: {
                            username: teacherUsername,
                        },
                    },
                },
            },
            populate: ['groups', 'groups.members'],
        });
    }
    public async findAllAssignmentsInClass(within: Class): Promise<Assignment[]> {
        return this.findAll({ where: { within: within }, populate: ['groups', 'groups.members'] });
    }
    public async deleteByClassAndId(within: Class, id: number): Promise<void> {
        return this.deleteWhere({ within: within, id: id });
    }
}
