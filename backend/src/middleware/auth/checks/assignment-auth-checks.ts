import {authorize} from "./auth-checks";
import {fetchClass} from "../../../services/classes";
import {fetchAllGroups} from "../../../services/groups";
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
        if (auth.accountType === "teacher") {
            const clazz = await fetchClass(classId);
            return clazz.teachers.map(mapToUsername).includes(auth.username);
        } 
            const groups = await fetchAllGroups(classId, assignmentId);
            return groups.some(group => group.members.map((member) => member.username).includes(auth.username) );
        
    }
);
