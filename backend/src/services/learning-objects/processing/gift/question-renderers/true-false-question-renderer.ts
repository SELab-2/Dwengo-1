import { GIFTQuestionRenderer } from './gift-question-renderer.js';
import { TrueFalse } from 'gift-pegjs';
import { ProcessingError } from '../../processing-error.js';

export class TrueFalseQuestionRenderer extends GIFTQuestionRenderer<TrueFalse> {
    render(_question: TrueFalse, _questionNumber: number): string {
        throw new ProcessingError("The question type 'TrueFalse' is not supported yet!");
    }
}
