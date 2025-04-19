import { UnauthorizedException } from '../exceptions/unauthorized-exception.js';
import { AuthenticatedRequest } from '../middleware/auth/authenticated-request.js';
import { createOrUpdateStudent } from '../services/students.js';
import { createOrUpdateTeacher } from '../services/teachers.js';
import { envVars, getEnvVar } from '../util/envVars.js';
import { Response } from "express";

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

export function getFrontendAuthConfig(): FrontendAuthConfig {
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

export async function postHelloHandler(req: AuthenticatedRequest, _res: Response): Promise<void> {
    const auth = req.auth;
    if (!auth) {
        throw new UnauthorizedException("Cannot say hello when not authenticated.");
    }
    const userData = {
        id: auth.username,
        username: auth.username,
        firstName: auth.firstName ?? '',
        lastName: auth.lastName ?? ''
    };
    if (auth.accountType === "student") {
        await createOrUpdateStudent({ ...userData }, { preventOverwrite: false });
    } else {
        await createOrUpdateTeacher({ ...userData }, { preventOverwrite: false });
    }
}
