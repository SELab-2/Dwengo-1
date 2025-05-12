import { Language } from "@dwengo-1/common/util/language";
import learningObjectService from "../../../services/learning-objects/learning-object-service";
import { authorize } from "../auth";
import { AuthenticatedRequest } from "../authenticated-request";
import { AuthenticationInfo } from "../authentication-info";

export const onlyAdminsForLearningObject = authorize(async (auth: AuthenticationInfo, req: AuthenticatedRequest) => {
    const { hruid } = req.params;
    const { version, language } = req.query;
    const admins = await learningObjectService.getAdmins({
        hruid,
        language: language as Language,
        version: parseInt(version as string)
    });
    return auth.username in admins;
});
