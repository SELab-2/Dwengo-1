import { AssignmentDTO } from './assignment';
import { StudentDTO } from './student';

export interface GroupDTO {
    assignment: number | AssignmentDTO;
    groupNumber: number;
    members: string[] | StudentDTO[];
}
