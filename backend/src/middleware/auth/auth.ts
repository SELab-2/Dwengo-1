import {EnvVars, getEnvVar} from "../../util/envvars.js";
import {expressjwt} from 'express-jwt';
import {JwtPayload} from 'jsonwebtoken'
import jwksClient from 'jwks-rsa';
import * as express from "express";
import * as jwt from "jsonwebtoken";
import {AuthenticatedRequest} from "./authenticated-request.js";
import {AuthenticationInfo} from "./authentication-info";

function createJwksClient(uri: string): jwksClient.JwksClient {
    return jwksClient({
        cache: true,
        rateLimit: true,
        jwksUri: uri,
    });
}

const idpConfigs = {
    student: {
        issuer: getEnvVar(EnvVars.IdpStudentUrl),
        jwksClient: createJwksClient(getEnvVar(EnvVars.IdpStudentJwksEndpoint)),
    },
    teacher: {
        issuer: getEnvVar(EnvVars.IdpTeacherUrl),
        jwksClient: createJwksClient(getEnvVar(EnvVars.IdpTeacherJwksEndpoint)),
    }
};

/**
 * Express middleware which verifies the JWT Bearer token if one is given in the request.
 */
export const authenticateUser = expressjwt({
    secret: async (_: express.Request, token: jwt.Jwt | undefined) => {
        if (!token?.payload || !(token.payload as JwtPayload).iss) {
            throw new Error("Invalid token");
        }

        let issuer = (token.payload as JwtPayload).iss;

        let idpConfig = Object.values(idpConfigs).find(config => config.issuer === issuer);
        if (!idpConfig) {
            throw new Error("Issuer not accepted.");
        }

        const signingKey = await idpConfig.jwksClient.getSigningKey(token.header.kid);
        if (!signingKey) {
            throw new Error("Signing key not found.");
        }
        return signingKey.getPublicKey();
    },
    audience: getEnvVar(EnvVars.IdpAudience),
    algorithms: ["RS256"],
    credentialsRequired: false
});

/**
 * Get an object with information about the authenticated user from a given authenticated request.
 */
function getAuthenticationInfo(req: AuthenticatedRequest): AuthenticationInfo | undefined {
    if (!req.auth) {
        return;
    }

    let issuer = req.auth.issuer;
    let accountType: "student" | "teacher";

    if (issuer === idpConfigs.student.issuer) {
        accountType = "student";
    } else if (issuer === idpConfigs.teacher.issuer) {
        accountType = "teacher";
    } else {
        return;
    }

    return {
        accountType: accountType,
        username: req.auth["preferred_username"]!,
        name: req.auth["name"],
        firstName: req.auth["given_name"],
        lastName: req.auth["family_name"],
        email: req.auth["email"],
    }
}

/**
 * Middleware which rejects unauthenticated users (with HTTP 401) and authenticated users which do not fulfill
 * the given access condition.
 * @param accessCondition Predicate over the current AuthenticationInfo. Access is only granted when this evaluates
 *                        to true.
 */
const authorize = (accessCondition: (auth: AuthenticationInfo) => boolean) => {
    return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction): void => {
        let authInfo = getAuthenticationInfo(req);
        if (!authInfo) {
            res.status(401).json({ message: "Unauthorized" });
        } else if (!accessCondition(authInfo)) {
            res.status(403).json({ message: "Forbidden" });
        } else {
            next();
        }
    }
}

/**
 * Middleware which rejects all unauthenticated users, but accepts all authenticated users.
 */
export const authenticatedOnly = authorize(_ => true);

/**
 * Middleware which rejects requests from unauthenticated users or users that aren't students.
 */
export const studentsOnly = authorize(auth => auth.accountType === "student");

/**
 * Middleware which rejects requests from unauthenticated users or users that aren't teachers.
 */
export const teachersOnly = authorize(auth => auth.accountType === "teacher");
