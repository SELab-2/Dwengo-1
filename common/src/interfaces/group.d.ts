import { AssignmentDTO } from './assignment';

export interface GroupDTO {
    assignment: number | AssignmentDTO;
    groupNumber: number;
    members: string[] | StudentDTO[];
}
