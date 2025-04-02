import {StudentDTO} from "./student";

export interface ClassJoinRequestDTO {
    requester: StudentDTO;
    class: string;
    status: ClassJoinRequestStatus;
}
