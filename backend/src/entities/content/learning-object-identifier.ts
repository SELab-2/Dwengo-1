import { Language } from '@dwengo-1/common/util/language';

export class LearningObjectIdentifier {
    constructor(
        public hruid: string,
        public language: Language,
        public version: number
    ) {
        // Do nothing
    }
}
