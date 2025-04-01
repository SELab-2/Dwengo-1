import cors from 'cors';
import { envVars, getEnvVar } from '../util/envVars.js';

export default cors({
    origin: getEnvVar(envVars.CorsAllowedOrigins).split(','),
    allowedHeaders: getEnvVar(envVars.CorsAllowedHeaders).split(','),
});
