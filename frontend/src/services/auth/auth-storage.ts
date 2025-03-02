import type {Role} from "@/services/auth/auth-types.ts";

export default {
    getActiveRole(): Role | undefined {
        return localStorage.getItem("activeRole") as Role | undefined;
    },
    setActiveRole(role: Role) {
        localStorage.setItem("activeRole", role);
    },
    deleteActiveRole() {
        localStorage.removeItem("activeRole");
    }
}
