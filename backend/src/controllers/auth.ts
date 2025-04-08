import { envVars, getEnvVar } from '../util/envVars.js';
import {AuthenticatedRequest} from "../middleware/auth/authenticated-request";
import {createStudent} from "../services/students";
import {AuthenticationInfo} from "../middleware/auth/authentication-info";
import {Request, Response} from "express";
import {createTeacher} from "../services/teachers";

interface FrontendIdpConfig {
    authority: string;
    clientId: string;
    scope: string;
    responseType: string;
}

interface FrontendAuthConfig {
    student: FrontendIdpConfig;
    teacher: FrontendIdpConfig;
}

const SCOPE = 'openid profile email';
const RESPONSE_TYPE = 'code';

function getFrontendAuthConfig(): FrontendAuthConfig {
    return {
        student: {
            authority: getEnvVar(envVars.IdpStudentUrl),
            clientId: getEnvVar(envVars.IdpStudentClientId),
            scope: SCOPE,
            responseType: RESPONSE_TYPE,
        },
        teacher: {
            authority: getEnvVar(envVars.IdpTeacherUrl),
            clientId: getEnvVar(envVars.IdpTeacherClientId),
            scope: SCOPE,
            responseType: RESPONSE_TYPE,
        },
    };
}

export function handleGetFrontendAuthConfig(_req: Request, res: Response): void {
    res.json(getFrontendAuthConfig());
}

export async function handleHello(req: AuthenticatedRequest): Promise<void> {
    const auth: AuthenticationInfo = req.auth!;
    if (auth.accountType === "teacher") {
        await createTeacher({
            id: auth.username,
            username: auth.username,
            firstName: auth.firstName ?? "",
            lastName: auth.lastName ?? "",
        }, true);
    } else {
        await createStudent({
            id: auth.username,
            username: auth.username,
            firstName: auth.firstName ?? "",
            lastName: auth.lastName ?? "",
        }, true);
    }
}
