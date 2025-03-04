// Can be placed in dotenv but found it redundant

// Import dotenv from "dotenv";

// Load .env file
// Dotenv.config();

import {EnvVars, getEnvVar} from "./util/envvars";

export const DWENGO_API_BASE = getEnvVar(EnvVars.LearningContentRepoApiBaseUrl);

export const FALLBACK_LANG = getEnvVar(EnvVars.FallbackLanguage);
