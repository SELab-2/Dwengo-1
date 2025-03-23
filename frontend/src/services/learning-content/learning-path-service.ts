import {GetEndpoint} from "@/services/api-client/endpoints/get-endpoint.ts";
import {LearningPath, type LearningPathDTO} from "@/services/learning-content/learning-path.ts";
import type {RemoteResource} from "@/services/api-client/remote-resource.ts";
import type {Language} from "@/services/learning-content/language.ts";
import {single} from "@/utils/response-assertions.ts";

const learningPathEndpoint = new GetEndpoint<{}, {search?: string, hruid?: string, language?: Language}, LearningPathDTO[]>(
    "/learningPath"
);

export function searchLearningPaths(query: string): RemoteResource<LearningPath[]> {
    return learningPathEndpoint
        .get({}, {search: query})
        .map(dtos => dtos.map(dto => LearningPath.fromDTO(dto)));
}

export function getLearningPath(hruid: string, language: Language): RemoteResource<LearningPath> {
    console.log({hruid, language})
    return learningPathEndpoint
        .get({}, {hruid, language})
        .map(it => {console.log(it); return it;})
        .map(dtos => LearningPath.fromDTO(single(dtos)));
}
