import { Language } from '@dwengo-1/common/util/language';
import learningPathService from '../../../services/learning-paths/learning-path-service';
import { authorize } from '../auth';
import { AuthenticatedRequest } from '../authenticated-request';
import { AuthenticationInfo } from '../authentication-info';

export const onlyAdminsForLearningPath = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const adminsForLearningPath = await learningPathService.getAdmins({
        hruid: req.params.hruid,
        language: req.params.language as Language,
    });
    return adminsForLearningPath && adminsForLearningPath.includes(auth.username);
});
