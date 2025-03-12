import { GIFTQuestionRenderer } from './gift-question-renderer.js';
import { ShortAnswer } from 'gift-pegjs';
import { ProcessingError } from '../../processing-error.js';

export class ShortQuestionRenderer extends GIFTQuestionRenderer<ShortAnswer> {
    render(question: ShortAnswer, questionNumber: number): string {
        throw new ProcessingError("The question type 'ShortAnswer' is not supported yet!");
    }
}
