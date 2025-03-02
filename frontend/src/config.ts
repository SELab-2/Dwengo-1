export const authConfig = {
    student: {
        authority: import.meta.env.VITE_STUDENT_AUTH_AUTHORITY || "https://auth.sel2-1.ugent.be/realms/student",
        clientId: import.meta.env.VITE_STUDENT_AUTH_CLIENT_ID || "dwengo",
        redirectUri: window.location.origin + "/callback",
        scope: import.meta.env.VITE_STUDENT_AUTH_SCOPE || "openid profile email"
    },
    teacher: {
        authority: import.meta.env.VITE_TEACHER_AUTH_AUTHORITY || "https://auth.sel2-1.ugent.be/realms/teacher",
        clientId: import.meta.env.VITE_TEACHER_AUTH_CLIENT_ID || "dwengo",
        redirectUri: window.location.origin + "/callback",
        scope: import.meta.env.VITE_TEACHER_AUTH_SCOPE || "openid profile email"
    }
};
