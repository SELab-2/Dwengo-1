import { envVars, getEnvVar } from '../util/envVars.js';

type FrontendIdpConfig = {
    authority: string;
    clientId: string;
    scope: string;
    responseType: string;
};

type FrontendAuthConfig = {
    student: FrontendIdpConfig;
    teacher: FrontendIdpConfig;
};

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
