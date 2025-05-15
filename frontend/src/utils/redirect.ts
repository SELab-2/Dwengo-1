export enum Redirect {
    AFTER_LOGIN_KEY = "redirectAfterLogin",
    HOME = "/user",
    LOGIN = "/login",
    ROOT = "/",
}

const NOT_ALLOWED_REDIRECTS = new Set<Redirect>([Redirect.HOME, Redirect.ROOT, Redirect.LOGIN]);

export function allowRedirect(path: string): boolean {
    return !NOT_ALLOWED_REDIRECTS.has(path as Redirect);
}
