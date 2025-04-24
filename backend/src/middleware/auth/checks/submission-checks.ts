import { LearningObjectIdentifier } from '../../../entities/content/learning-object-identifier';
import { fetchSubmission } from '../../../services/submissions';
import { AuthenticatedRequest } from '../authenticated-request';
import { AuthenticationInfo } from '../authentication-info';
import { authorize } from './auth-checks';
import { FALLBACK_LANG } from '../../../config';
import { mapToUsername } from '../../../interfaces/user';
import { languageMap } from '@dwengo-1/common/util/language';

export const onlyAllowSubmitter = authorize(
    (auth: AuthenticationInfo, req: AuthenticatedRequest) => (req.body as { submitter: string }).submitter === auth.username
);

export const onlyAllowIfHasAccessToSubmission = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const { hruid: lohruid, id: submissionNumber } = req.params;
    const { language: lang, version: version } = req.query;

    const loId = new LearningObjectIdentifier(lohruid, languageMap[lang as string] ?? FALLBACK_LANG, Number(version));
    const submission = await fetchSubmission(loId, Number(submissionNumber));

    if (auth.accountType === 'teacher') {
        // Dit kan niet werken om dat al deze objecten niet gepopulate zijn.
        return submission.onBehalfOf.assignment.within.teachers.map(mapToUsername).includes(auth.username);
    }

    return submission.onBehalfOf.members.map(mapToUsername).includes(auth.username);
});
