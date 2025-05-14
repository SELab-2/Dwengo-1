import { Language } from '@dwengo-1/common/util/language';
import learningObjectService from '../../../services/learning-objects/learning-object-service.js';
import { authorize } from '../auth.js';
import { AuthenticatedRequest } from '../authenticated-request.js';
import { AuthenticationInfo } from '../authentication-info.js';

export const onlyAdminsForLearningObject = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const { hruid } = req.params;
    const { version, language } = req.query;
    const admins = await learningObjectService.getAdmins({
        hruid,
        language: language as Language,
        version: parseInt(version as string),
    });
    return admins.includes(auth.username);
});
