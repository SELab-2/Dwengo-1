import { envVars, getEnvVar } from '../../util/envVars.js';
import { expressjwt } from 'express-jwt';
import { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from './authenticated-request.js';
import { AuthenticationInfo } from './authentication-info.js';
import { ForbiddenException, UnauthorizedException } from '../../exceptions.js';

const JWKS_CACHE = true;
const JWKS_RATE_LIMIT = true;
const REQUEST_PROPERTY_FOR_JWT_PAYLOAD = 'jwtPayload';
const JWT_ALGORITHM = 'RS256'; // Not configurable via env vars since supporting other algorithms would
// Require additional libraries to be added.

const JWT_PROPERTY_NAMES = {
    username: 'preferred_username',
    firstName: 'given_name',
    lastName: 'family_name',
    name: 'name',
    email: 'email',
};

function createJwksClient(uri: string): jwksClient.JwksClient {
    return jwksClient({
        cache: JWKS_CACHE,
        rateLimit: JWKS_RATE_LIMIT,
        jwksUri: uri,
    });
}

const idpConfigs = {
    student: {
        issuer: getEnvVar(envVars.IdpStudentUrl),
        jwksClient: createJwksClient(getEnvVar(envVars.IdpStudentJwksEndpoint)),
    },
    teacher: {
        issuer: getEnvVar(envVars.IdpTeacherUrl),
        jwksClient: createJwksClient(getEnvVar(envVars.IdpTeacherJwksEndpoint)),
    },
};

/**
 * Express middleware which verifies the JWT Bearer token if one is given in the request.
 */
const verifyJwtToken = expressjwt({
    secret: async (_: express.Request, token: jwt.Jwt | undefined) => {
        if (!token?.payload || !(token.payload as JwtPayload).iss) {
            throw new Error('Invalid token');
        }

        const issuer = (token.payload as JwtPayload).iss;

        const idpConfig = Object.values(idpConfigs).find((config) => config.issuer === issuer);
        if (!idpConfig) {
            throw new Error('Issuer not accepted.');
        }

        const signingKey = await idpConfig.jwksClient.getSigningKey(token.header.kid);
        if (!signingKey) {
            throw new Error('Signing key not found.');
        }
        return signingKey.getPublicKey();
    },
    audience: getEnvVar(envVars.IdpAudience),
    algorithms: [JWT_ALGORITHM],
    credentialsRequired: false,
    requestProperty: REQUEST_PROPERTY_FOR_JWT_PAYLOAD,
});

/**
 * Get an object with information about the authenticated user from a given authenticated request.
 */
function getAuthenticationInfo(req: AuthenticatedRequest): AuthenticationInfo | undefined {
    if (!req.jwtPayload) {
        return;
    }
    const issuer = req.jwtPayload.iss;
    let accountType: 'student' | 'teacher';

    if (issuer === idpConfigs.student.issuer) {
        accountType = 'student';
    } else if (issuer === idpConfigs.teacher.issuer) {
        accountType = 'teacher';
    } else {
        return;
    }
    return {
        accountType: accountType,
        username: req.jwtPayload[JWT_PROPERTY_NAMES.username]!,
        name: req.jwtPayload[JWT_PROPERTY_NAMES.name],
        firstName: req.jwtPayload[JWT_PROPERTY_NAMES.firstName],
        lastName: req.jwtPayload[JWT_PROPERTY_NAMES.lastName],
        email: req.jwtPayload[JWT_PROPERTY_NAMES.email],
    };
}

/**
 * Add the AuthenticationInfo object with the information about the current authentication to the request in order
 * to avoid that the routers have to deal with the JWT token.
 */
const addAuthenticationInfo = (req: AuthenticatedRequest, _res: express.Response, next: express.NextFunction) => {
    req.auth = getAuthenticationInfo(req);
    next();
};

export const authenticateUser = [verifyJwtToken, addAuthenticationInfo];

/**
 * Middleware which rejects unauthenticated users (with HTTP 401) and authenticated users which do not fulfill
 * the given access condition.
 * @param accessCondition Predicate over the current AuthenticationInfo. Access is only granted when this evaluates
 *                        to true.
 */
export const authorize =
    (accessCondition: (auth: AuthenticationInfo) => boolean) =>
    (req: AuthenticatedRequest, _res: express.Response, next: express.NextFunction): void => {
        if (!req.auth) {
            throw new UnauthorizedException();
        } else if (!accessCondition(req.auth)) {
            throw new ForbiddenException();
        } else {
            next();
        }
    };

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
