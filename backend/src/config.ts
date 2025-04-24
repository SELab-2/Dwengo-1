import { envVars, getEnvVar } from './util/envVars.js';

// API
export const DWENGO_API_BASE = getEnvVar(envVars.LearningContentRepoApiBaseUrl);
export const FALLBACK_LANG = getEnvVar(envVars.FallbackLanguage);

export const FALLBACK_SEQ_NUM = 1;
export const FALLBACK_VERSION_NUM = 1;
