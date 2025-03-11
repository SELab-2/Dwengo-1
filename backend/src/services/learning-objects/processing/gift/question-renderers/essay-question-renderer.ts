import { GIFTQuestionRenderer } from './gift-question-renderer';
import { Essay } from 'gift-pegjs';

export class EssayQuestionRenderer extends GIFTQuestionRenderer<Essay> {
    render(question: Essay, questionNumber: number): string {
        let renderedHtml = '';
        if (question.title) {
            renderedHtml += `<h2 class='gift-title' id='gift-q${questionNumber}-title'>${question.title}</h2>\n`;
        }
        if (question.stem) {
            renderedHtml += `<p class='gift-stem' id='gift-q${questionNumber}-stem'>${question.stem.text}</p>\n`;
        }
        renderedHtml += `<textarea class='gift-essay-answer' id='gift-q${questionNumber}-answer'></textarea>\n`;
        return renderedHtml;
    }
}
