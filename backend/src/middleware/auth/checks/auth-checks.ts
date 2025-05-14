import { AuthenticationInfo } from '../authentication-info.js';
import { AuthenticatedRequest } from '../authenticated-request.js';
import * as express from 'express';
import { RequestHandler } from 'express';
import { UnauthorizedException } from '../../../exceptions/unauthorized-exception.js';
import { ForbiddenException } from '../../../exceptions/forbidden-exception.js';
import { envVars, getEnvVar } from '../../../util/envVars.js';

/**
 * Middleware which rejects unauthenticated users (with HTTP 401) and authenticated users which do not fulfill
 * the given access condition.
 * @param accessCondition Predicate over the current AuthenticationInfo. Access is only granted when this evaluates
 *                        to true.
 */
export function authorize<P, ResBody, ReqBody, ReqQuery, Locals extends Record<string, unknown>>(
    accessCondition: (auth: AuthenticationInfo, req: AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery, Locals>) => boolean | Promise<boolean>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
    // Bypass authentication during testing
    if (getEnvVar(envVars.RunMode) === 'test') {
        return async (
            _req: AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery, Locals>,
            _res: express.Response,
            next: express.NextFunction
        ): Promise<void> => {
            next();
        };
    }

    return async (
        req: AuthenticatedRequest<P, ResBody, ReqBody, ReqQuery, Locals>,
        _res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        if (!req.auth) {
            throw new UnauthorizedException();
        } else if (!(await accessCondition(req.auth, req))) {
            throw new ForbiddenException();
        } else {
            next();
        }
    };
}

/**
 * Middleware which rejects all unauthenticated users, but accepts all authenticated users.
 */
export const authenticatedOnly = authorize((_) => true);
/**
 * Middleware which rejects requests from unauthenticated users or users that aren't students.
 */
export const studentsOnly = authorize((auth) => auth.accountType === 'student');
/**
 * Middleware which rejects requests from unauthenticated users or users that aren't teachers.
 */
export const teachersOnly = authorize((auth) => auth.accountType === 'teacher');
/**
 * Middleware which is to be used on requests no normal user should be able to execute.
 * Since there is no concept of administrator accounts yet, currently, those requests will always be blocked.
 */
export const adminOnly = authorize(() => false);
