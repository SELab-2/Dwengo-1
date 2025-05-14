import { Language } from '@dwengo-1/common/util/language';
import learningPathService from '../../../services/learning-paths/learning-path-service.js';
import { authorize } from '../auth.js';
import { AuthenticatedRequest } from '../authenticated-request.js';
import { AuthenticationInfo } from '../authentication-info.js';

export const onlyAdminsForLearningPath = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const adminsForLearningPath = await learningPathService.getAdmins({
        hruid: req.params.hruid,
        language: req.params.language as Language,
    });
    return adminsForLearningPath && adminsForLearningPath.includes(auth.username);
});
