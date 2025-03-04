import cors from "cors";
import {EnvVars, getEnvVar} from "../util/envvars.js";

export default cors({
    origin: getEnvVar(EnvVars.CorsAllowedOrigins).split(','),
    allowedHeaders: getEnvVar(EnvVars.CorsAllowedHeaders).split(',')
});
