import { ClassJoinRequest } from "../entities/classes/class-join-request.entity";
import { Student } from "../entities/users/student.entity";
import { Teacher } from "../entities/users/teacher.entity";

export interface ClassDTO {
    id: string;
    displayName: string;
    teachers: string[];
    students: string[];
    joinRequests: string[];
    endpoints?: {
        classes: string;
        questions: string;
        invitations: string;
        groups: string;
    };
}
