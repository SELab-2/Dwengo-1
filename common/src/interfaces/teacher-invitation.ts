import { UserDTO } from './user';
import { ClassDTO } from './class';

export interface TeacherInvitationDTO {
    sender: string | UserDTO;
    receiver: string | UserDTO;
    class: string | ClassDTO;
}

export interface TeacherInvitationData {
    sender: string;
    receiver: string;
    class: string;
}
