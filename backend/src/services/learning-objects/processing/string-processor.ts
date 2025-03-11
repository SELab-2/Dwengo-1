import Processor from './processor';
import { LearningObject } from '../../../entities/content/learning-object.entity';

export abstract class StringProcessor extends Processor<string> {
    /**
     * Function which actually executes the rendering of a learning object.
     * By default, this just means rendering the content in the content property of the learning object (interpreted
     * as string)
     *
     * When implementing this function, we may assume that we are responsible for the content type of the learning
     * object.
     *
     * @param toRender Learning object to render
     * @protected
     */
    protected renderLearningObjectFn(toRender: LearningObject): string {
        return this.render(toRender.content.toString('ascii'));
    }
}
