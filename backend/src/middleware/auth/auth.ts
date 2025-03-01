import {EnvVars, getEnvVar} from "../../util/envvars.js";
import {expressjwt} from 'express-jwt';
import {JwtPayload} from 'jsonwebtoken'
import jwksClient from 'jwks-rsa';
import * as express from "express";
import * as jwt from "jsonwebtoken";
import {AuthenticatedRequest} from "./authenticated-request.js";

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

const authorizeRole = (studentsAllowed: boolean, teachersAllowed: boolean) => {
    return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction): void => {
        if (!req.auth) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const issuer = req.auth.iss;
        if (issuer === idpConfigs.student.issuer && !studentsAllowed) {
            res.status(403).json({ message: "Students not allowed" });
            return;
        }
        if (issuer === idpConfigs.teacher.issuer && !teachersAllowed) {
            res.status(403).json({ message: "Teachers not allowed" });
            return;
        }

        next(); // User is allowed
    };
};

export const authenticatedOnly = authorizeRole(true, true);
export const studentsOnly = authorizeRole(true, false);
export const teachersOnly = authorizeRole(false, true);
