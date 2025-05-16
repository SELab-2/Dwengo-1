import { authorize } from './auth-checks';
import { AuthenticationInfo } from '../authentication-info';
import { AuthenticatedRequest } from '../authenticated-request';
import { AccountType } from '@dwengo-1/common/util/account-types';

/**
 * Only allows requests whose learning path personalization query parameters ('forGroup' / 'assignmentNo' / 'classId')
 * are
 * - either not set
 * - or set to a group the user is in,
 * - or set to anything if the user is a teacher.
 */
export const onlyAllowPersonalizationForOwnGroup = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const { forGroup, assignmentNo, classId } = req.params;
    if (auth.accountType === AccountType.Student && forGroup && assignmentNo && classId) {
        // TODO: groupNumber?
        // Const group = await fetchGroup(Number(classId), Number(assignmentNo), )
        return false;
    }
    return true;
});
