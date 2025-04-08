import {authorize} from "./auth-checks";
import {AuthenticationInfo} from "../authentication-info";
import {AuthenticatedRequest} from "../authenticated-request";
import {getClassesByTeacher} from "../../../services/teachers";

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
            const classes: string[] = (await getClassesByTeacher(auth.username, false)) as string[];
            return req.params.classId in classes;
        } else {
            return false;
        }
    }
);
