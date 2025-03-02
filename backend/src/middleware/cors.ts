import cors from "cors";
import {EnvVars, getEnvVar} from "../util/envvars";

export default cors({
    origin: getEnvVar(EnvVars.CorsAllowedOrigins).split(',')
});
