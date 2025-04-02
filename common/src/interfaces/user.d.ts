export interface UserDTO {
    id?: string;
    username: string;
    firstName: string;
    lastName: string;
    endpoints?: {
        self: string;
        classes: string;
        questions: string;
        invitations: string;
    };
}
