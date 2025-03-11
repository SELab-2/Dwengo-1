import {GIFTQuestionRenderer} from "./gift-question-renderer";
import {Description} from "gift-pegjs";
import {ProcessingError} from "../../processing-error";

export class DescriptionQuestionRenderer extends GIFTQuestionRenderer<Description> {
    render(question: Description, questionNumber: number): string {
        throw new ProcessingError("The question type 'Description' is not supported yet!");
    }
}
