import {GIFTQuestionRenderer} from "./gift-question-renderer";
import {Matching} from "gift-pegjs";
import {ProcessingError} from "../../processing-error";

export class MatchingQuestionRenderer extends GIFTQuestionRenderer<Matching> {
    render(question: Matching, questionNumber: number): string {
        throw new ProcessingError("The question type 'Matching' is not supported yet!");
    }
}
