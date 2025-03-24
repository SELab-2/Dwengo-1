import {GetEndpoint} from "@/services/api-client/endpoints/get-endpoint.ts";
import type {LearningObject} from "@/services/learning-content/learning-object.ts";
import type {Language} from "@/services/learning-content/language.ts";
import {GetHtmlEndpoint} from "@/services/api-client/endpoints/get-html-endpoint.ts";

const getLearningObjectMetadataEndpoint = new GetEndpoint<{hruid: string}, {language: Language, version: number}, LearningObject>(
    "/learningObject/:hruid"
);

const getLearningObjectHtmlEndpoint = new GetHtmlEndpoint<{hruid: string}, {language: Language, version: number}>(
    "/learningObject/:hruid/html"
);

export function getLearningObjectMetadata(
    hruid: string,
    language: Language,
    version: number
): Promise<LearningObject> {
    return getLearningObjectMetadataEndpoint.get({hruid}, {language, version});
}

export function getLearningObjectHTML(
    hruid: string,
    language: Language,
    version: number
): Promise<Document> {
    return getLearningObjectHtmlEndpoint.get({hruid}, {language, version});
}
