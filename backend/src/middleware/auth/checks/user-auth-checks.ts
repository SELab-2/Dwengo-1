import { authorize } from './auth-checks.js';
import { AuthenticationInfo } from '../authentication-info.js';
import { AuthenticatedRequest } from '../authenticated-request.js';

/**
 * Only allow the user whose username is in the path parameter "username" to access the endpoint.
 */
export const onlyAllowUserHimself = authorize((auth: AuthenticationInfo, req: AuthenticatedRequest) => req.params.username === auth.username);
