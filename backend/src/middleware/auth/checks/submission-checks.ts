import { languageMap } from '@dwengo-1/common/util/language';
import { LearningObjectIdentifier } from '../../../entities/content/learning-object-identifier.js';
import { fetchSubmission } from '../../../services/submissions.js';
import { AuthenticatedRequest } from '../authenticated-request.js';
import { AuthenticationInfo } from '../authentication-info.js';
import { authorize } from './auth-checks.js';
import { FALLBACK_LANG } from '../../../config.js';
import { mapToUsername } from '../../../interfaces/user.js';
import { AccountType } from '@dwengo-1/common/util/account-types';
import { fetchClass } from '../../../services/classes.js';
import { fetchGroup } from '../../../services/groups.js';
import { requireFields } from '../../../controllers/error-helper.js';
import { SubmissionDTO } from '@dwengo-1/common/interfaces/submission';

export const onlyAllowSubmitter = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
        const submittedFor = (req.body as SubmissionDTO).submitter.username;
        const submittedBy = auth.username;
        return submittedFor === submittedBy;
    }
);

export const onlyAllowIfHasAccessToSubmission = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const { hruid: lohruid, id: submissionNumber } = req.params;
    const { language: lang, version: version } = req.query;

    const loId = new LearningObjectIdentifier(lohruid, languageMap[lang as string] ?? FALLBACK_LANG, Number(version));
    const submission = await fetchSubmission(loId, Number(submissionNumber));

    if (auth.accountType === AccountType.Teacher) {
        // Dit kan niet werken om dat al deze objecten niet gepopulate zijn.
        return submission.onBehalfOf.assignment.within.teachers.map(mapToUsername).includes(auth.username);
    }

    return submission.onBehalfOf.members.map(mapToUsername).includes(auth.username);
});

export const onlyAllowIfHasAccessToSubmissionFromParams = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const { classId, assignmentId, groupId } = req.query;

    requireFields({ classId, assignmentId, groupId });

    if (auth.accountType === AccountType.Teacher) {
        const cls = await fetchClass(classId as string);
        return cls.teachers.map(mapToUsername).includes(auth.username);
    }

    const group = await fetchGroup(classId as string, Number(assignmentId as string), Number(groupId as string));
    return group.members.map(mapToUsername).includes(auth.username);
});
