import { authorize } from './auth-checks.js';
import { fetchClass } from '../../../services/classes.js';
import { fetchAllGroups } from '../../../services/groups.js';
import { mapToUsername } from '../../../interfaces/user.js';
import {AccountType} from "@dwengo-1/common/util/account-types";

/**
 * Expects the path to contain the path parameters 'classId' and 'id' (meaning the ID of the assignment).
 * Only allows requests from users who are
 * - either teachers of the class the assignment was posted in,
 * - or students in a group of the assignment.
 */
export const onlyAllowIfHasAccessToAssignment = authorize(async (auth, req) => {
    const { classid: classId, id: assignmentId } = req.params as { classid: string; id: number };
    if (auth.accountType === AccountType.Teacher) {
        const clazz = await fetchClass(classId);
        return clazz.teachers.map(mapToUsername).includes(auth.username);
    }
    const groups = await fetchAllGroups(classId, assignmentId);
    return groups.some((group) => group.members.map((member) => member.username).includes(auth.username));
});
