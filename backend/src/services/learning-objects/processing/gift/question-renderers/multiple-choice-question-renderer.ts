import {GIFTQuestionRenderer} from "./gift-question-renderer";
import {MultipleChoice} from "gift-pegjs";

export class MultipleChoiceQuestionRenderer extends GIFTQuestionRenderer<MultipleChoice> {
    render(question: MultipleChoice): string {
        return "";
    }
}
