import {LearningObject} from "../../../entities/content/learning-object.entity";
import {ProcessingError} from "./processing-error";
import {DwengoContentType} from "./content-type";

/**
 * Abstract base class for all processors.
 * Each processor is responsible for a specific format a learning object can be in, which i tcan render to HTML.
 *
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/processor.js
 */
abstract class Processor<T> {
    protected constructor(public contentType: DwengoContentType) {}

    /**
     * Render the given object.
     *
     * @param toRender Object which has to be rendered to HTML. This object has to be in the format for which this
     *                 Processor is responsible.
     * @return Rendered HTML-string
     * @throws ProcessingError if the rendering fails.
     */
    render(toRender: T): string {
        return this.renderFn(toRender);
    }

    /**
     * Render a learning object with the content type for which this processor is responsible.
     * @param toRender
     */
    renderLearningObject(toRender: LearningObject): string {
        if (toRender.contentType !== this.contentType) {
            throw new ProcessingError(
                `Unsupported content type: ${toRender.contentType}.
                This processor is only responsible for content of type ${this.contentType}.`
            );
        }
        return this.renderLearningObjectFn(toRender);
    }

    /**
     * Function which actually renders the content.
     *
     * @param toRender Content to be rendered
     * @return Rendered HTML as a string
     * @protected
     */
    protected abstract renderFn(toRender: T): string;

    /**
     * Function which actually executes the rendering of a learning object.
     * By default, this just means rendering the content in the content property of the learning object.
     *
     * When implementing this function, we may assume that we are responsible for the content type of the learning
     * object.
     *
     * @param toRender Learning object to render
     * @protected
     */
    protected renderLearningObjectFn(toRender: LearningObject): string {
        return this.render(toRender.content as T);
    }
}

export default Processor;
