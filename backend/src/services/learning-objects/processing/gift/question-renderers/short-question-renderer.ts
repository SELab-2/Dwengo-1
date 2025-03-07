import {GIFTQuestionRenderer} from "./gift-question-renderer";
import {ShortAnswer} from "gift-pegjs";
import {ProcessingError} from "../../processing-error";

export class ShortQuestionRenderer extends GIFTQuestionRenderer<ShortAnswer> {
    render(question: ShortAnswer): string {
        throw new ProcessingError("The question type 'ShortAnswer' is not supported yet!");
    }
}
