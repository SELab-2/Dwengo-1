/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/gift/gift_processor.js
 */

import DOMPurify from 'isomorphic-dompurify';
import {GIFTQuestion, parse} from "gift-pegjs"
import {DwengoContentType} from "../content-type";
import {GIFTQuestionRenderer} from "./question-renderers/gift-question-renderer";
import {MultipleChoiceQuestionRenderer} from "./question-renderers/multiple-choice-question-renderer";
import {CategoryQuestionRenderer} from "./question-renderers/category-question-renderer";
import {DescriptionQuestionRenderer} from "./question-renderers/description-question-renderer";
import {EssayQuestionRenderer} from "./question-renderers/essay-question-renderer";
import {MatchingQuestionRenderer} from "./question-renderers/matching-question-renderer";
import {NumericalQuestionRenderer} from "./question-renderers/numerical-question-renderer";
import {ShortQuestionRenderer} from "./question-renderers/short-question-renderer";
import {TrueFalseQuestionRenderer} from "./question-renderers/true-false-question-renderer";
import {StringProcessor} from "../string-processor";

class GiftProcessor extends StringProcessor {

    private renderers: RendererMap = {
        Category: new CategoryQuestionRenderer(),
        Description: new DescriptionQuestionRenderer(),
        Essay: new EssayQuestionRenderer(),
        Matching: new MatchingQuestionRenderer(),
        Numerical: new NumericalQuestionRenderer(),
        Short: new ShortQuestionRenderer(),
        TF: new TrueFalseQuestionRenderer(),
        MC: new MultipleChoiceQuestionRenderer()
    }

    constructor() {
        super(DwengoContentType.GIFT);
    }

    override renderFn(giftString: string) {
        const quizQuestions: GIFTQuestion[] = parse(giftString);

        let html = "<div class='learning-object-gift'>\n";
        let i = 1;
        for (let question of quizQuestions) {
            html += `    <div class='gift-question' id='gift-q${i}'>\n`;
            html += "        " + this.renderQuestion(question, i).replaceAll(/\n(.+)/g, "\n        $1"); // replace for indentation.
            html += `    </div>\n`;
            i++;
        }
        html += "</div>\n"

        return DOMPurify.sanitize(html);
    }

    private renderQuestion<T extends GIFTQuestion>(question: T, questionNumber: number): string {
        const renderer = this.renderers[question.type] as GIFTQuestionRenderer<T>;
        return renderer.render(question, questionNumber);
    }
}

type RendererMap = {
    [K in GIFTQuestion["type"]]: GIFTQuestionRenderer<Extract<GIFTQuestion, { type: K }>>
};

export default GiftProcessor;
