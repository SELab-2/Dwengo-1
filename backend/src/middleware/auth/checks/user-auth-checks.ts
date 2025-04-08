import {authorize} from "./auth-checks";
import {AuthenticationInfo} from "../authentication-info";
import {AuthenticatedRequest} from "../authenticated-request";

/**
 * Only allow the user whose username is in the path parameter "username" to access the endpoint.
 */
export const onlyAllowUserHimself = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => req.params.username === auth.username
);
