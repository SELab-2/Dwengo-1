import { EnvVars, getEnvVar } from '../util/envvars.js';

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
            authority: getEnvVar(EnvVars.IdpStudentUrl),
            clientId: getEnvVar(EnvVars.IdpStudentClientId),
            scope: SCOPE,
            responseType: RESPONSE_TYPE,
        },
        teacher: {
            authority: getEnvVar(EnvVars.IdpTeacherUrl),
            clientId: getEnvVar(EnvVars.IdpTeacherClientId),
            scope: SCOPE,
            responseType: RESPONSE_TYPE,
        },
    };
}
