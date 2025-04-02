export interface TeacherDTO {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    endpoints?: {
        classes: string;
        questions: string;
        invitations: string;
        groups: string;
    };
}
