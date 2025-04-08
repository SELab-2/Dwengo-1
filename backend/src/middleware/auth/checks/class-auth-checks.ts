import {authorize} from "./auth-checks";
import {AuthenticationInfo} from "../authentication-info";
import {AuthenticatedRequest} from "../authenticated-request";
import {getClass} from "../../../services/classes";

async function teaches(teacherUsername: string, classId: string) {
    const clazz = await getClass(classId);
    return clazz != null && teacherUsername in clazz.teachers;
}

/**
 * To be used on a request with path parameters username and classId.
 * Only allows requests whose username parameter is equal to the username of the user who is logged in and requests
 * whose classId parameter references a class the logged-in user is a teacher of.
 */
export const onlyAllowStudentHimselfAndTeachersOfClass = authorize(
    async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
        if (req.params.username === auth.username) {
            return true;
        } else if (auth.accountType === "teacher") {
            return teaches(auth.username, req.params.classId);
        } else {
            return false;
        }
    }
);

/**
 * Only let the request pass through if its path parameter "username" is the username of the currently logged-in
 * teacher and the path parameter "classId" refers to a class the teacher teaches.
 */
export const onlyAllowTeacherOfClass = authorize(
    async (auth: AuthenticationInfo, req: AuthenticatedRequest) =>
        req.params.username === auth.username && teaches(auth.username, req.params.classId),
);
