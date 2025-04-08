import { GroupDTO } from './group';

export interface AssignmentDTO {
    id: number;
    class: string; // Id of class 'within'
    title: string;
    description: string;
    learningPath: string;
    language: string;
    groups?: GroupDTO[] | string[][]; // TODO
}
