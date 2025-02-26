import { Language } from './language.js';

export class LearningObjectIdentifier {
    constructor(
        public hruid: string,
        public language: Language,
        public version: string
    ) {}
}
