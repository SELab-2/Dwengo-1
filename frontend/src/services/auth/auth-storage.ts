import type { Role } from "@/services/auth/auth.d.ts";

export default {
    /**
     * Get the role the user is currently logged in as from the local persistent storage.
     */
    getActiveRole(): Role | undefined {
        return localStorage.getItem("activeRole") as Role | undefined;
    },

    /**
     * Set the role the user is currently logged in as from the local persistent storage.
     * This should happen when the user logs in with another account.
     */
    setActiveRole(role: Role): void {
        localStorage.setItem("activeRole", role);
    },

    /**
     * Remove the saved current role from the local persistent storage.
     * This should happen when the user is logged out.
     */
    deleteActiveRole(): void {
        localStorage.removeItem("activeRole");
    },
};
