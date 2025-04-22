import {authorize} from "./auth-checks";
import {fetchClass} from "../../../services/classes";
import {fetchGroup} from "../../../services/groups";
import {mapToUsername} from "../../../interfaces/user";

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
            const clazz = await fetchClass(classId);
            return clazz.teachers.map(mapToUsername).includes(auth.username);
        }  // User is student
            const group = await fetchGroup(classId, assignmentId, groupId);
            return group.members.map(mapToUsername).includes(auth.username);
        
    }
);
