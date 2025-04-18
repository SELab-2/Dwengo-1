import {authorize} from "./auth-checks";
import {AuthenticationInfo} from "../authentication-info";
import {AuthenticatedRequest} from "../authenticated-request";

export const onlyAllowSenderOrReceiver = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) =>
        req.params.sender === auth.username || req.params.receiver === auth.username
);

export const onlyAllowSender = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) =>
        req.params.sender === auth.username
);

export const onlyAllowSenderBody = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) =>
        req.body.sender === auth.username
);

export const onlyAllowReceiverBody = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) =>
        req.body.receiver === auth.username
);
