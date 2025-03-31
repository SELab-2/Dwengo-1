/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/processing_proxy.js
 */

import BlockImageProcessor from './image/block-image-processor.js';
import InlineImageProcessor from './image/inline-image-processor.js';
import { MarkdownProcessor } from './markdown/markdown-processor.js';
import TextProcessor from './text/text-processor.js';
import AudioProcessor from './audio/audio-processor.js';
import PdfProcessor from './pdf/pdf-processor.js';
import ExternProcessor from './extern/extern-processor.js';
import GiftProcessor from './gift/gift-processor.js';
import { LearningObject } from '../../../entities/content/learning-object.entity.js';
import Processor from './processor.js';
import { DwengoContentType } from './content-type.js';
import { replaceAsync } from '../../../util/async.js';
import { LearningObjectIdentifier } from 'dwengo-1-common/src/interfaces/learning-content';
import { Language } from 'dwengo-1-common/src/util/language.js';

const EMBEDDED_LEARNING_OBJECT_PLACEHOLDER = /<learning-object hruid="([^"]+)" language="([^"]+)" version="([^"]+)"\/>/g;
const LEARNING_OBJECT_DOES_NOT_EXIST = "<div class='non-existing-learning-object' />";

class ProcessingService {
    private processors!: Map<DwengoContentType, Processor<any>>;

    constructor() {
        const processors = [
            new InlineImageProcessor(),
            new BlockImageProcessor(),
            new MarkdownProcessor(),
            new TextProcessor(),
            new AudioProcessor(),
            new PdfProcessor(),
            new ExternProcessor(),
            new GiftProcessor(),
        ];

        this.processors = new Map(processors.map((processor) => [processor.contentType, processor]));
    }

    /**
     * Render the given learning object.
     * @param learningObject The learning object to render
     * @param fetchEmbeddedLearningObjects A function which takes a learning object identifier as an argument and
     *                                     returns the corresponding learning object. This is used to fetch learning
     *                                     objects embedded into this one.
     *                                     If this argument is omitted, embedded learning objects will be represented
     *                                     by placeholders.
     * @returns Rendered HTML for this LearningObject as a string.
     */
    async render(
        learningObject: LearningObject,
        fetchEmbeddedLearningObjects?: (loId: LearningObjectIdentifier) => Promise<LearningObject | null>
    ): Promise<string> {
        const html = this.processors.get(learningObject.contentType)!.renderLearningObject(learningObject);
        if (fetchEmbeddedLearningObjects) {
            // Replace all embedded learning objects.
            return replaceAsync(
                html,
                EMBEDDED_LEARNING_OBJECT_PLACEHOLDER,
                async (_, hruid: string, language: string, version: string): Promise<string> => {
                    // Fetch the embedded learning object...
                    const learningObject = await fetchEmbeddedLearningObjects({
                        hruid,
                        language: language as Language,
                        version: parseInt(version),
                    });

                    // If it does not exist, replace it by a placeholder.
                    if (!learningObject) {
                        return LEARNING_OBJECT_DOES_NOT_EXIST;
                    }

                    // ... and render it.
                    return this.render(learningObject);
                }
            );
        }
        return html;
    }
}

export default new ProcessingService();
