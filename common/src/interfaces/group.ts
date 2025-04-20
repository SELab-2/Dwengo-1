import { AssignmentDTO } from './assignment';
import { ClassDTO } from './class';
import { StudentDTO } from './student';

export interface GroupDTO {
    class: string | ClassDTO;
    assignment: number | AssignmentDTO;
    groupNumber: number;
    members?: string[] | StudentDTO[];
}

export interface GroupDTOId {
    class: string;
    assignment: number;
    groupNumber: number;
}
