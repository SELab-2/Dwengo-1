import {authorize} from "./auth-checks";
import {getClass} from "../../../services/classes";
import {getGroup} from "../../../services/groups";

/**
 * Expects the path to contain the path parameters 'classid', 'assignmentid' and 'groupid'.
 * Only allows requests from users who are
 * - either teachers of the class the assignment for the group was posted in,
 * - or students in the group
 */
export const onlyAllowIfHasAccessToGroup = authorize(
    async (auth, req) => {
        const { classid: classId, assignmentid: assignmentId, groupid: groupId } =
            req.params as { classid: string, assignmentid: number, groupid: number };

        if (auth.accountType === "teacher") {
            const clazz = await getClass(classId);
            return auth.username in clazz!.teachers;
        } else { // user is student
            const group = await getGroup(classId, assignmentId, groupId, false);
            return group === null ? false : auth.username in (group.members as string[]);
        }
    }
);
