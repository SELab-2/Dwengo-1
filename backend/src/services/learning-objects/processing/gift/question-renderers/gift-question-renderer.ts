import {GIFTQuestion} from "gift-pegjs";

/**
 * Subclasses of this class are renderers which can render a specific type of GIFT questions to HTML.
 */
export abstract class GIFTQuestionRenderer<T extends GIFTQuestion> {
    /**
     * Render the given question to HTML.
     * @param question The question.
     * @param questionNumber The index number of the question.
     * @returns The question rendered as HTML.
     */
    abstract render(question: T, questionNumber: number): string;
}
