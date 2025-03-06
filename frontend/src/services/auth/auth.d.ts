import {type User, UserManager} from "oidc-client-ts";

export type AuthState = {
    user: User | null,
    accessToken: string | null,
    activeRole: Role | null
};

export type FrontendAuthConfig = {
    student: FrontendIdpConfig,
    teacher: FrontendIdpConfig
};

export type FrontendIdpConfig = {
    authority: string,
    clientId: string,
    scope: string,
    responseType: string
};

export type Role = "student" | "teacher";
export type UserManagersForRoles = {student: UserManager, teacher: UserManager};
