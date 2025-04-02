import { StudentDTO } from './student';
import {ClassJoinRequestStatus} from "../util/class-join-request";

export interface ClassJoinRequestDTO {
    requester: StudentDTO;
    class: string;
    status: ClassJoinRequestStatus;
}
