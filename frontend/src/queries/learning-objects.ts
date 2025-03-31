import {type MaybeRefOrGetter, toValue} from "vue";
import type {Language} from "@/data-objects/language.ts";
import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import {getLearningObjectController} from "@/controllers/controllers.ts";
import type {LearningObject} from "@/data-objects/learning-object.ts";
import type {LearningPath} from "@/data-objects/learning-path.ts";

const LEARNING_OBJECT_KEY = "learningObject";
const learningObjectController = getLearningObjectController();

export function useLearningObjectMetadataQuery(
    hruid: MaybeRefOrGetter<string>,
    language: MaybeRefOrGetter<Language>,
    version: MaybeRefOrGetter<number>
): UseQueryReturnType<LearningObject, Error> {
    return useQuery({
        queryKey: [LEARNING_OBJECT_KEY, "metadata", hruid, language, version],
        queryFn: () => {
            const [hruidVal, languageVal, versionVal] = [toValue(hruid), toValue(language), toValue(version)];
            return learningObjectController.getMetadata(hruidVal, languageVal, versionVal)
        },
        enabled: () => Boolean(toValue(hruid)) && Boolean(toValue(language)) && Boolean(toValue(version)),
    });
}

export function useLearningObjectHTMLQuery(
    hruid: MaybeRefOrGetter<string>,
    language: MaybeRefOrGetter<Language>,
    version: MaybeRefOrGetter<number>
): UseQueryReturnType<Document, Error> {
    return useQuery({
        queryKey: [LEARNING_OBJECT_KEY, "html", hruid, language, version],
        queryFn: () => {
            const [hruidVal, languageVal, versionVal] = [toValue(hruid), toValue(language), toValue(version)];
            return learningObjectController.getHTML(hruidVal, languageVal, versionVal)
        },
        enabled: () => Boolean(toValue(hruid)) && Boolean(toValue(language)) && Boolean(toValue(version)),
    });
}

export function useLearningObjectListForPathQuery(
    learningPath: MaybeRefOrGetter<LearningPath>
): UseQueryReturnType<LearningObject, Error> {
    return useQuery({
        queryKey: [LEARNING_OBJECT_KEY, "onPath", learningPath],
        queryFn: () => {
            let learningObjects = [];
            for (let node of toValue(learningPath).nodesAsList) {
                learningObjects.push(
                    learningObjectController.getMetadata(node.learningobjectHruid, node.language, node.version)
                );
            }
            return Promise.all(learningObjects);
        },
        enabled: () => Boolean(toValue(learningPath)),
    });
}
