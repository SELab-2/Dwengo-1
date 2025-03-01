/**
 * Object with information about the user who is currently logged in.
 */
export type AuthenticationInfo = {
    accountType: "student" | "teacher",
    username: string,
    name?: string,
    firstName?: string,
    lastName?: string,
    email?: string
};
