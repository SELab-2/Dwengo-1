import { LearningObjectIdentifierDTO } from '@dwengo-1/common/interfaces/learning-content';

export function isValidHttpUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url, 'http://test.be');
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

export function getUrlStringForLearningObject(learningObjectId: LearningObjectIdentifierDTO): string {
    let url = `/learningObject/${learningObjectId.hruid}/html?language=${learningObjectId.language}`;
    if (learningObjectId.version) {
        url += `&version=${learningObjectId.version}`;
    }
    return url;
}

export function getUrlStringForLearningObjectHTML(learningObjectIdentifier: LearningObjectIdentifierDTO): string {
    let url = `/learningObject/${learningObjectIdentifier.hruid}/html?language=${learningObjectIdentifier.language}`;
    if (learningObjectIdentifier.version) {
        url += `&version=${learningObjectIdentifier.version}`;
    }
    return url;
}
