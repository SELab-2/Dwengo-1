import { GIFTQuestionRenderer } from './gift-question-renderer.js';
import { Matching } from 'gift-pegjs';
import { ProcessingError } from '../../processing-error.js';

export class MatchingQuestionRenderer extends GIFTQuestionRenderer<Matching> {
    render(question: Matching, questionNumber: number): string {
        throw new ProcessingError("The question type 'Matching' is not supported yet!");
    }
}
