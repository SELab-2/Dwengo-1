import { UnauthorizedException } from '../exceptions/unauthorized-exception.js';
import { getLogger } from '../logging/initalize.js';
import { AuthenticatedRequest } from '../middleware/auth/authenticated-request.js';
import { envVars, getEnvVar } from '../util/envVars.js';
import { createOrUpdateStudent, createStudent } from '../services/students';
import { AuthenticationInfo } from '../middleware/auth/authentication-info';
import { Request, Response } from 'express';
import { createOrUpdateTeacher, createTeacher } from '../services/teachers';

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

const logger = getLogger();

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

export function handleGetFrontendAuthConfig(_req: Request, res: Response): void {
    res.json(getFrontendAuthConfig());
}

export async function handleHello(req: AuthenticatedRequest): Promise<void> {
    const auth: AuthenticationInfo = req.auth!;
    if (auth.accountType === 'teacher') {
        await createTeacher(
            {
                id: auth.username,
                username: auth.username,
                firstName: auth.firstName ?? '',
                lastName: auth.lastName ?? '',
            },
            true
        );
    } else {
        await createStudent(
            {
                id: auth.username,
                username: auth.username,
                firstName: auth.firstName ?? '',
                lastName: auth.lastName ?? '',
            },
            true
        );
    }
}

export async function postHelloHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const auth = req.auth;
    if (!auth) {
        throw new UnauthorizedException('Cannot say hello when not authenticated.');
    }
    const userData = {
        id: auth.username,
        username: auth.username,
        firstName: auth.firstName ?? '',
        lastName: auth.lastName ?? '',
    };
    if (auth.accountType === 'student') {
        await createOrUpdateStudent(userData);
        logger.debug(`Synchronized student ${userData.username} with IDP`);
    } else {
        await createOrUpdateTeacher(userData);
        logger.debug(`Synchronized teacher ${userData.username} with IDP`);
    }
    res.status(200).send({ message: 'Welcome!' });
}
