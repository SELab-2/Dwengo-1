import { GIFTQuestionRenderer } from './gift-question-renderer.js';
import { MultipleChoice } from 'gift-pegjs';

export class MultipleChoiceQuestionRenderer extends GIFTQuestionRenderer<MultipleChoice> {
    override render(question: MultipleChoice, questionNumber: number): string {
        let renderedHtml = '';
        if (question.title) {
            renderedHtml += `<h2 class='gift-title' id='gift-q${questionNumber}-title'>${question.title}</h2>\n`;
        }
        if (question.stem) {
            renderedHtml += `<p class='gift-stem' id='gift-q${questionNumber}-stem'>${question.stem.text}</p>\n`;
        }
        let i = 0;
        for (const choice of question.choices) {
            renderedHtml += `<div class="gift-choice-div">\n`;
            renderedHtml += `    <input type='radio' id='gift-q${questionNumber}-choice-${i}' name='gift-q${questionNumber}-choices' value="${i}"/>\n`;
            renderedHtml += `    <label for='gift-q${questionNumber}-choice-${i}'>${choice.text}</label>\n`;
            renderedHtml += `</div>\n`;
            i++;
        }
        return renderedHtml;
    }
}
