import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import {AuthenticationInfo} from "./authentication-info";

export interface AuthenticatedRequest extends Request {
    // Properties are optional since the user is not necessarily authenticated.
    jwtPayload?: JwtPayload;
    auth?: AuthenticationInfo;
}
