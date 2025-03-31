import { GroupDTO } from 'dwengo-1-backend/src/interfaces/group.js';

export interface AssignmentDTO {
    id: number;
    class: string; // Id of class 'within'
    title: string;
    description: string;
    learningPath: string;
    language: string;
    groups?: GroupDTO[] | string[]; // TODO
}
