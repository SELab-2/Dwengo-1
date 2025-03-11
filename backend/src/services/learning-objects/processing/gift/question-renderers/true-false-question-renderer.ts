import {GIFTQuestionRenderer} from "./gift-question-renderer";
import {TrueFalse} from "gift-pegjs";
import {ProcessingError} from "../../processing-error";

export class TrueFalseQuestionRenderer extends GIFTQuestionRenderer<TrueFalse> {
    render(question: TrueFalse, questionNumber: number): string {
        throw new ProcessingError("The question type 'TrueFalse' is not supported yet!");
    }
}
