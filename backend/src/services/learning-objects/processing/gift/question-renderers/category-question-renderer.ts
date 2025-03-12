import { GIFTQuestionRenderer } from './gift-question-renderer.js';
import { Category } from 'gift-pegjs';
import { ProcessingError } from '../../processing-error.js';

export class CategoryQuestionRenderer extends GIFTQuestionRenderer<Category> {
    render(question: Category, questionNumber: number): string {
        throw new ProcessingError("The question type 'Category' is not supported yet!");
    }
}
