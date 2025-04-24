import { authorize } from './auth-checks.js';
import { AuthenticationInfo } from '../authentication-info.js';
import { AuthenticatedRequest } from '../authenticated-request.js';
import { fetchClass } from '../../../services/classes.js';
import { mapToUsername } from '../../../interfaces/user.js';

async function teaches(teacherUsername: string, classId: string): Promise<boolean> {
    const clazz = await fetchClass(classId);
    return clazz.teachers.map(mapToUsername).includes(teacherUsername);
}

/**
 * To be used on a request with path parameters username and classId.
 * Only allows requests whose username parameter is equal to the username of the user who is logged in and requests
 * whose classId parameter references a class the logged-in user is a teacher of.
 */
export const onlyAllowStudentHimselfAndTeachersOfClass = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    if (req.params.username === auth.username) {
        return true;
    } else if (auth.accountType === 'teacher') {
        return teaches(auth.username, req.params.classId);
    }
    return false;
});

/**
 * Only let the request pass through if its path parameter "username" is the username of the currently logged-in
 * teacher and the path parameter "classId" refers to a class the teacher teaches.
 */
export const onlyAllowTeacherOfClass = authorize(
    async (auth: AuthenticationInfo, req: AuthenticatedRequest) => req.params.username === auth.username && teaches(auth.username, req.params.classId)
);

/**
 * Only let the request pass through if the class id in it refers to a class the current user is in (as a student
 * or teacher)
 */
export const onlyAllowIfInClass = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const classId = req.params.classId ?? req.params.classid ?? req.params.id;
    const clazz = await fetchClass(classId);
    if (auth.accountType === 'teacher') {
        return clazz.teachers.map(mapToUsername).includes(auth.username);
    }
    return clazz.students.map(mapToUsername).includes(auth.username);
});

/**
 * Only allows the request to pass if the 'class' property in its body is a class the current user is a member of.
 */
export const onlyAllowOwnClassInBody = authorize(async (auth, req) => {
    const classId = (req.body as { class: string })?.class;
    const clazz = await fetchClass(classId);

    if (auth.accountType === 'teacher') {
        return clazz.teachers.map(mapToUsername).includes(auth.username);
    }
    return clazz.students.map(mapToUsername).includes(auth.username);
});
