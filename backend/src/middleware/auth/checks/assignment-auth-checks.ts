import {authorize} from "./auth-checks";
import {fetchAssignment, getAssignment} from "../../../services/assignments";
import {fetchClass, getClass} from "../../../services/classes";
import {getAllGroups} from "../../../services/groups";
import {mapToUsername} from "../../../interfaces/user";

/**
 * Expects the path to contain the path parameters 'classId' and 'id' (meaning the ID of the assignment).
 * Only allows requests from users who are
 * - either teachers of the class the assignment was posted in,
 * - or students in a group of the assignment.
 */
export const onlyAllowIfHasAccessToAssignment = authorize(
    async (auth, req) => {
        const { classid: classId, id: assignmentId } = req.params as { classid: string, id: number };
        const assignment = await fetchAssignment(classId, assignmentId);
        if (auth.accountType === "teacher") {
            const clazz = await fetchClass(assignment.class);
            return clazz.teachers.map(mapToUsername).includes(auth.username);
        } else {
            const groups = await getAllGroups(classId, assignmentId, false);
            return groups.some(group => group.members.map(mapToUsername).includes(auth.username) );
        }
    }
);
