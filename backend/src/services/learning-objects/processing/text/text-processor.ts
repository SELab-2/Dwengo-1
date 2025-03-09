/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/text/text_processor.js
 */

import DOMPurify from 'isomorphic-dompurify';
import {DwengoContentType} from "../content-type.js";
import {StringProcessor} from "../string-processor";

class TextProcessor extends StringProcessor {
    constructor() {
        super(DwengoContentType.TEXT_PLAIN);
    }

    override renderFn(text: string) {
        // Sanitize plain text to prevent xss.
        return DOMPurify.sanitize(text);
    }
}

export default TextProcessor;
