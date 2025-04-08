import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AuthenticationInfo } from './authentication-info.js';
import * as core from "express-serve-static-core";

export interface AuthenticatedRequest<
    P = core.ParamsDictionary,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = core.Query,
    Locals extends Record<string, unknown> = Record<string, unknown>,
> extends Request<P,ResBody,ReqBody,ReqQuery,Locals> {
    // Properties are optional since the user is not necessarily authenticated.
    jwtPayload?: JwtPayload;
    auth?: AuthenticationInfo;
}
