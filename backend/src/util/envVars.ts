const PREFIX = 'DWENGO_';
const DB_PREFIX = PREFIX + 'DB_';
const IDP_PREFIX = PREFIX + 'AUTH_';
const STUDENT_IDP_PREFIX = IDP_PREFIX + 'STUDENT_';
const TEACHER_IDP_PREFIX = IDP_PREFIX + 'TEACHER_';
const CORS_PREFIX = PREFIX + 'CORS_';

interface EnvVar {
    key: string;
    required?: boolean;
    defaultValue?: number | string | boolean;
}

export const envVars: Record<string, EnvVar> = {
    Port: { key: PREFIX + 'PORT', defaultValue: 3000 },
    DbHost: { key: DB_PREFIX + 'HOST', required: true },
    DbPort: { key: DB_PREFIX + 'PORT', defaultValue: 5432 },
    DbName: { key: DB_PREFIX + 'NAME', defaultValue: 'dwengo' },
    DbUsername: { key: DB_PREFIX + 'USERNAME', required: true },
    DbPassword: { key: DB_PREFIX + 'PASSWORD', required: true },
    DbUpdate: { key: DB_PREFIX + 'UPDATE', defaultValue: false },
    LearningContentRepoApiBaseUrl: { key: PREFIX + 'LEARNING_CONTENT_REPO_API_BASE_URL', defaultValue: 'https://dwengo.org/backend/api' },
    FallbackLanguage: { key: PREFIX + 'FALLBACK_LANGUAGE', defaultValue: 'nl' },
    UserContentPrefix: { key: DB_PREFIX + 'USER_CONTENT_PREFIX', defaultValue: 'u_' },
    IdpStudentUrl: { key: STUDENT_IDP_PREFIX + 'URL', required: true },
    IdpStudentClientId: { key: STUDENT_IDP_PREFIX + 'CLIENT_ID', required: true },
    IdpStudentJwksEndpoint: { key: STUDENT_IDP_PREFIX + 'JWKS_ENDPOINT', required: true },
    IdpTeacherUrl: { key: TEACHER_IDP_PREFIX + 'URL', required: true },
    IdpTeacherClientId: { key: TEACHER_IDP_PREFIX + 'CLIENT_ID', required: true },
    IdpTeacherJwksEndpoint: { key: TEACHER_IDP_PREFIX + 'JWKS_ENDPOINT', required: true },
    IdpAudience: { key: IDP_PREFIX + 'AUDIENCE', defaultValue: 'account' },
    CorsAllowedOrigins: { key: CORS_PREFIX + 'ALLOWED_ORIGINS', defaultValue: '' },
    CorsAllowedHeaders: { key: CORS_PREFIX + 'ALLOWED_HEADERS', defaultValue: 'Authorization,Content-Type' },
} as const;

/**
 * Returns the value of the given environment variable if it is set.
 * Otherwise,
 * - throw an error if the environment variable was required,
 * - return the default value if there is one and it was not required,
 * - return an empty string if the environment variable is not required and there is also no default.
 * @param envVar The properties of the environment variable (from the EnvVar object).
 */
export function getEnvVar(envVar: EnvVar): string {
    const value: string | undefined = process.env[envVar.key];
    if (value) {
        return value;
    } else if (envVar.required) {
        throw new Error(`Missing environment variable: ${envVar.key}`);
    } else {
        return String(envVar.defaultValue) || '';
    }
}

export function getNumericEnvVar(envVar: EnvVar): number {
    const valueString = getEnvVar(envVar);
    const value = parseInt(valueString);
    if (isNaN(value)) {
        throw new Error(`Invalid value for environment variable ${envVar.key}: ${valueString}. Expected a number.`);
    } else {
        return value;
    }
}
