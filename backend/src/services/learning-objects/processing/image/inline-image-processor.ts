/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/image/inline_image_processor.js
 */

import DOMPurify from 'isomorphic-dompurify';
import { DwengoContentType } from '../content-type.js';
import { ProcessingError } from '../processing-error.js';
import { isValidHttpUrl } from '../../../../util/links';
import { StringProcessor } from '../string-processor';

class InlineImageProcessor extends StringProcessor {
    constructor(contentType: DwengoContentType = DwengoContentType.IMAGE_INLINE) {
        super(contentType);
    }

    override renderFn(imageUrl: string) {
        if (!isValidHttpUrl(imageUrl)) {
            throw new ProcessingError(`Image URL is invalid: ${imageUrl}`);
        }
        return DOMPurify.sanitize(`<img src="${imageUrl}" alt="">`);
    }
}

export default InlineImageProcessor;
