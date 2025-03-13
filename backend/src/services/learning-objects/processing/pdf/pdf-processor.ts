/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/pdf/pdf_processor.js
 *
 * WARNING: The support for PDF learning objects is currently still experimental.
 */

import DOMPurify from 'isomorphic-dompurify';
import { DwengoContentType } from '../content-type.js';
import { isValidHttpUrl } from '../../../../util/links.js';
import { ProcessingError } from '../processing-error.js';
import { StringProcessor } from '../string-processor.js';

class PdfProcessor extends StringProcessor {
    constructor() {
        super(DwengoContentType.APPLICATION_PDF);
    }

    override renderFn(pdfUrl: string) {
        if (!isValidHttpUrl(pdfUrl)) {
            throw new ProcessingError(`PDF URL is invalid: ${pdfUrl}`);
        }

        return DOMPurify.sanitize(
            `
            <embed src="${pdfUrl}" type="application/pdf" width="100%" height="800px"/>
            `,
            { ADD_TAGS: ['embed'] }
        );
    }
}

export default PdfProcessor;
