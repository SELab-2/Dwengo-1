import { GIFTQuestionRenderer } from './gift-question-renderer';
import { Numerical } from 'gift-pegjs';
import { ProcessingError } from '../../processing-error';

export class NumericalQuestionRenderer extends GIFTQuestionRenderer<Numerical> {
    render(question: Numerical, questionNumber: number): string {
        throw new ProcessingError("The question type 'Numerical' is not supported yet!");
    }
}
