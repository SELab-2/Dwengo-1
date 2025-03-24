import {GetEndpoint} from "@/services/api-client/endpoints/get-endpoint.ts";
import {LearningPath, type LearningPathDTO} from "@/services/learning-content/learning-path.ts";
import type {Language} from "@/services/learning-content/language.ts";
import {single} from "@/utils/response-assertions.ts";

const learningPathEndpoint = new GetEndpoint<
    {},
    {search?: string, hruid?: string, language?: Language, forGroup?: string, forStudent?: string},
    LearningPathDTO[]
>("/learningPath");

export async function searchLearningPaths(query: string): Promise<LearningPath[]> {
    let dtos = await learningPathEndpoint.get({}, {search: query})
    return dtos.map(dto => LearningPath.fromDTO(dto));
}

export async function getLearningPath(hruid: string, language: Language, options?: {forGroup?: string, forStudent?: string}): Promise<LearningPath> {
    let dtos = await learningPathEndpoint.get(
        {},
        {hruid, language, forGroup: options?.forGroup, forStudent: options?.forStudent}
    );
    return LearningPath.fromDTO(single(dtos));
}
