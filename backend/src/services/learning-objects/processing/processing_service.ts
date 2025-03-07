/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/processing_proxy.js
 */

import BlockImageProcessor from "./image/block_image_processor.js";
import InlineImageProcessor from "./image/inline_image_processor.js";
import { CTSchemaProcessor } from "./ct_schema/ct_schema_processor.js";
import { MarkdownProcessor } from "./markdown/markdown_processor.js";
import TextProcessor from "./text/text_processor.js";
import AudioProcessor from "./audio/audio_processor.js";
import PdfProcessor from "./pdf/pdf_processor.js";
import ExternProcessor from "./extern/extern_processor.js";
import BlocklyProcessor from "./blockly/blockly_processor.js";
import GiftProcessor from "./gift/gift_processor.js";
import {LearningObject} from "../../../entities/content/learning-object.entity";
import Processor from "./processor";
import {DwengoContentType} from "./content_type";

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
            new BlocklyProcessor(),
            new GiftProcessor(),
            new CTSchemaProcessor()
        ];

        processors.forEach(processor => {
            this.processors.set(processor.contentType, processor);
        });
    }

    /**
     * Render the given learning object.
     * @param learningObject
     */
    render(learningObject: LearningObject): string {
        return this.processors.get(learningObject.contentType)!.renderLearningObject(learningObject);
    }
}

export default ProcessingService;
