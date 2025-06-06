import apiClient from "@/services/api-client/api-client.ts";
import type { FrontendAuthConfig } from "@/services/auth/auth.d.ts";
import type { UserManagerSettings } from "oidc-client-ts";

export const AUTH_CONFIG_ENDPOINT = "auth/config";

/**
 * Fetch the authentication configuration from the backend.
 */
export async function loadAuthConfig(): Promise<Record<string, UserManagerSettings>> {
    const authConfigResponse = await apiClient.get<FrontendAuthConfig>(AUTH_CONFIG_ENDPOINT);
    const authConfig = authConfigResponse.data;
    return {
        student: {
            authority: authConfig.student.authority,
            client_id: authConfig.student.clientId,
            redirect_uri: window.location.origin + "/callback",
            response_type: authConfig.student.responseType,
            scope: authConfig.student.scope,
            post_logout_redirect_uri: window.location.origin,
        },
        teacher: {
            authority: authConfig.teacher.authority,
            client_id: authConfig.teacher.clientId,
            redirect_uri: window.location.origin + "/callback",
            response_type: authConfig.teacher.responseType,
            scope: authConfig.teacher.scope,
            post_logout_redirect_uri: window.location.origin,
        },
    };
}
