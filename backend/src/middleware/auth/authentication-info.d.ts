/**
 * Object with information about the user who is currently logged in.
 */
export interface AuthenticationInfo {
    accountType: 'student' | 'teacher';
    username: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}
