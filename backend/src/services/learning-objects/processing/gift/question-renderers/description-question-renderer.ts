import { GIFTQuestionRenderer } from './gift-question-renderer.js';
import { Description } from 'gift-pegjs';
import { ProcessingError } from '../../processing-error.js';

export class DescriptionQuestionRenderer extends GIFTQuestionRenderer<Description> {
    override render(_question: Description, _questionNumber: number): string {
        throw new ProcessingError("The question type 'Description' is not supported yet!");
    }
}
