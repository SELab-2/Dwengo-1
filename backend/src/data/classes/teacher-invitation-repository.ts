import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Class } from '../../entities/classes/class.entity.js';
import { TeacherInvitation } from '../../entities/classes/teacher-invitation.entity.js';
import { Teacher } from '../../entities/users/teacher.entity.js';

export class TeacherInvitationRepository extends DwengoEntityRepository<TeacherInvitation> {
    public findAllInvitationsForClass(
        clazz: Class
    ): Promise<TeacherInvitation[]> {
        return this.findAll({ where: { class: clazz } });
    }
    public findAllInvitationsBy(sender: Teacher): Promise<TeacherInvitation[]> {
        return this.findAll({ where: { sender: sender } });
    }
    public findAllInvitationsFor(
        receiver: Teacher
    ): Promise<TeacherInvitation[]> {
        return this.findAll({ where: { receiver: receiver } });
    }
    public deleteBy(
        clazz: Class,
        sender: Teacher,
        receiver: Teacher
    ): Promise<void> {
        return this.deleteWhere({
            sender: sender,
            receiver: receiver,
            class: clazz,
        });
    }
}
