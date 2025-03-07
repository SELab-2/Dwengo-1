import {LearningObjectIdentifier} from "../interfaces/learning-content";

export function isValidHttpUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch (e) {
        return false;
    }
}

export function getUrlStringForLearningObject(learningObjectIdentifier: LearningObjectIdentifier): string {
    let url = `/learningObject/${learningObjectIdentifier.hruid}/html?language=${learningObjectIdentifier.language}`;
    if (learningObjectIdentifier.version) {
        url += `&version=${learningObjectIdentifier.version}`;
    }
    return url;
}
