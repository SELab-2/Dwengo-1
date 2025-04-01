import { GIFTQuestionRenderer } from './gift-question-renderer.js';
import { Numerical } from 'gift-pegjs';
import { ProcessingError } from '../../processing-error.js';

export class NumericalQuestionRenderer extends GIFTQuestionRenderer<Numerical> {
    override render(_question: Numerical, _questionNumber: number): string {
        throw new ProcessingError("The question type 'Numerical' is not supported yet!");
    }
}
