import {authorize} from "./auth-checks";
import {getAssignment} from "../../../services/assignments";
import {getClass} from "../../../services/classes";
import {getAllGroups} from "../../../services/groups";

/**
 * Expects the path to contain the path parameters 'classId' and 'id' (meaning the ID of the assignment).
 * Only allows requests from users who are
 * - either teachers of the class the assignment was posted in,
 * - or students in a group of the assignment.
 */
export const onlyAllowIfHasAccessToAssignment = authorize(
    async (auth, req) => {
        const { classid: classId, id: assignmentId } = req.params as { classid: string, id: number };
        const assignment = await getAssignment(classId, assignmentId);
        if (assignment === null) {
            return false;
        } else if (auth.accountType === "teacher") {
            const clazz = await getClass(assignment.class);
            return auth.username in clazz!.teachers;
        } else {
            const groups = await getAllGroups(classId, assignmentId, false);
            return groups.some(group => auth.username in (group.members as string[]));
        }
    }
);
