import {GetEndpoint} from "@/services/api-client/endpoints/get-endpoint.ts";
import type {LearningObject} from "@/services/learning-content/learning-object.ts";
import type {Language} from "@/services/learning-content/language.ts";
import type {RemoteResource} from "@/services/api-client/remote-resource.ts";

const getLearningObjectMetadataEndpoint = new GetEndpoint<{hruid: string}, {language: Language, version: number}, LearningObject>(
    "/learningObject/:hruid"
);

export function getLearningObjectMetadata(hruid: string, language: Language, version: number): RemoteResource<LearningObject> {
    return getLearningObjectMetadataEndpoint
        .get({hruid}, {language, version});
}
