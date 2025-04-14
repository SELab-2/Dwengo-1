import { UserDTO } from './user';
import {ClassStatus} from "../util/class-join-request";

export interface TeacherInvitationDTO {
    sender: string | UserDTO;
    receiver: string | UserDTO;
    classId: string;
    status: ClassStatus;
}

export interface TeacherInvitationData {
    sender: string;
    receiver: string;
    class: string;
    accepted?: boolean;
}
