import { EnvVars, getEnvVar } from './util/envvars.js';

// API
export const DWENGO_API_BASE = getEnvVar(EnvVars.LearningContentRepoApiBaseUrl);
export const FALLBACK_LANG = getEnvVar(EnvVars.FallbackLanguage);

// Logging
export const LOG_LEVEL: string = 'info';
export const LOKI_HOST: string = process.env.LOKI_HOST || 'http://localhost:3102';
