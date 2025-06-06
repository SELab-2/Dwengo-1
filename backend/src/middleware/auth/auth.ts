import { envVars, getEnvVar } from '../../util/envVars.js';
import { expressjwt } from 'express-jwt';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import * as express from 'express';
import { AuthenticatedRequest } from './authenticated-request.js';
import { AuthenticationInfo } from './authentication-info.js';
import { UnauthorizedException } from '../../exceptions/unauthorized-exception.js';

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
            throw new UnauthorizedException('Invalid token.');
        }

        const issuer = (token.payload as JwtPayload).iss;

        const idpConfig = Object.values(idpConfigs).find((config) => config.issuer === issuer);
        if (!idpConfig) {
            throw new UnauthorizedException('Issuer not accepted.');
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
        return undefined;
    }
    const issuer = req.jwtPayload.iss;
    let accountType: 'student' | 'teacher';

    if (issuer === idpConfigs.student.issuer) {
        accountType = 'student';
    } else if (issuer === idpConfigs.teacher.issuer) {
        accountType = 'teacher';
    } else {
        return undefined;
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
function addAuthenticationInfo(req: AuthenticatedRequest, _res: express.Response, next: express.NextFunction): void {
    req.auth = getAuthenticationInfo(req);
    next();
}

export const authenticateUser = [verifyJwtToken, addAuthenticationInfo];
