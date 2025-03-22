import { envVars, getEnvVar } from './util/envVars.js';

// API
export const DWENGO_API_BASE = getEnvVar(envVars.LearningContentRepoApiBaseUrl);
export const FALLBACK_LANG = getEnvVar(envVars.FallbackLanguage);

// Logging
export const LOG_LEVEL: string = 'development' === process.env.NODE_ENV ? 'debug' : 'info';
export const LOKI_HOST: string = process.env.LOKI_HOST || 'http://localhost:3102';

export const FALLBACK_SEQ_NUM = 1;
