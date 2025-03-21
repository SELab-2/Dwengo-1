import { EnvVars, getEnvVar } from './util/envvars.js';

// API
export const DWENGO_API_BASE = getEnvVar(EnvVars.LearningContentRepoApiBaseUrl);
export const FALLBACK_LANG = getEnvVar(EnvVars.FallbackLanguage);

export const FALLBACK_SEQ_NUM = 1;
