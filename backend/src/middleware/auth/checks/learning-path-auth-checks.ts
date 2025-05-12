import learningPathService from "../../../services/learning-paths/learning-path-service";
import { authorize } from "../auth";
import { AuthenticatedRequest } from "../authenticated-request";
import { AuthenticationInfo } from "../authentication-info";

export const onlyAdminsForLearningPath = authorize((auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const adminsForLearningPath = learningPathService.getAdmins({
        hruid: req.body.hruid,
        language: req.body.language
    });
    return adminsForLearningPath && auth.username in adminsForLearningPath;
});
