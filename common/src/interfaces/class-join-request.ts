import { StudentDTO } from './student';
import { ClassStatus } from '../util/class-join-request';

export interface ClassJoinRequestDTO {
    requester: StudentDTO;
    class: string;
    status: ClassStatus;
}
