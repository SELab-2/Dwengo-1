/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/image/block_image_processor.js
 */

import InlineImageProcessor from './inline-image-processor.js';
import DOMPurify from 'isomorphic-dompurify';

class BlockImageProcessor extends InlineImageProcessor {
    constructor() {
        super();
    }

    override renderFn(imageUrl: string): string {
        const inlineHtml = super.render(imageUrl);
        return DOMPurify.sanitize(`<div>${inlineHtml}</div>`);
    }
}

export default BlockImageProcessor;
