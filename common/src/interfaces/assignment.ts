import { GroupDTO } from './group';

export interface AssignmentDTO {
    id: number;
    within: string;
    title: string;
    description: string;
    learningPath: string;
    language: string;
    groups?: GroupDTO[] | string[]; // TODO
}
