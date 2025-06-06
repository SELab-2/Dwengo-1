import { GroupDTO } from './group';

export interface AssignmentDTO {
    id: number;
    within: string;
    title: string;
    description: string;
    learningPath: string;
    language: string;
    deadline: Date | null;
    groups: GroupDTO[] | string[][];
}

export interface AssignmentDTOId {
    id: number;
    within: string;
}
