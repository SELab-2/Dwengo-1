import {authorize} from "./auth-checks";
import {AuthenticationInfo} from "../authentication-info";
import {AuthenticatedRequest} from "../authenticated-request";
import {fetchGroup, getGroup} from "../../../services/groups";

/**
 * Only allows requests whose learning path personalization query parameters ('forGroup' / 'assignmentNo' / 'classId')
 * are
 * - either not set
 * - or set to a group the user is in,
 * - or set to anything if the user is a teacher.
 */
export const onlyAllowPersonalizationForOwnGroup = authorize(
    async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
        const {forGroup, assignmentNo, classId} = req.params;
        if (auth.accountType === "student" && forGroup && assignmentNo && classId) {
            // TODO: groupNumber? 
            // const group = await fetchGroup(Number(classId), Number(assignmentNo), )
            return false;
        } else {
            return true;
        }
    }
);
