import {GIFTQuestionRenderer} from "./gift-question-renderer";
import {Essay} from "gift-pegjs";

export class EssayQuestionRenderer extends GIFTQuestionRenderer<Essay> {
    render(question: Essay): string {
        return "";
    }
}
