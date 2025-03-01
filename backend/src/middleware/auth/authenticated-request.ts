import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    auth?: JwtPayload; // Optional, as req.auth might be undefined if authentication is optional
}
