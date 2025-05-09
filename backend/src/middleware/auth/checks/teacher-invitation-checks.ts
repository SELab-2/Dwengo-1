import { authorize } from './auth-checks.js';
import { AuthenticationInfo } from '../authentication-info.js';
import { AuthenticatedRequest } from '../authenticated-request.js';

export const onlyAllowSenderOrReceiver = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => req.params.sender === auth.username || req.params.receiver === auth.username
);

export const onlyAllowSender = authorize((auth: AuthenticationInfo, req: AuthenticatedRequest) => req.params.sender === auth.username);

export const onlyAllowSenderBody = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => (req.body as { sender: string }).sender === auth.username
);

export const onlyAllowReceiverBody = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => (req.body as { receiver: string }).receiver === auth.username
);
