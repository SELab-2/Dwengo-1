import {GetEndpoint} from "@/services/api-client/endpoints/get-endpoint.ts";
import {LearningPath, type LearningPathDTO} from "@/services/learning-content/learning-path.ts";
import type {RemoteResource} from "@/services/api-client/remote-resource.ts";

const searchLearningPathsEndpoint = new GetEndpoint<{}, {query: string}, LearningPathDTO[]>(
    "/learningObjects/:query"
);

export function searchLearningPaths(query: string): RemoteResource<LearningPath[]> {
    return searchLearningPathsEndpoint
        .get({}, {query: query})
        .map(dtos => dtos.map(dto => LearningPath.fromDTO(dto)));
}
