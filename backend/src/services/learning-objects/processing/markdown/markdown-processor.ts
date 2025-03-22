/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/markdown/markdown_processor.js
 */

import { marked } from 'marked';
import InlineImageProcessor from '../image/inline-image-processor.js';
import { DwengoContentType } from '../content-type.js';
import dwengoMarkedRenderer from './dwengo-marked-renderer.js';
import { StringProcessor } from '../string-processor.js';
import { ProcessingError } from '../processing-error.js';

class MarkdownProcessor extends StringProcessor {
    constructor() {
        super(DwengoContentType.TEXT_MARKDOWN);
    }

    override renderFn(mdText: string) {
        try {
            marked.use({ renderer: dwengoMarkedRenderer });
            const html = marked(mdText, { async: false });
            return this.replaceLinks(html); // Replace html image links path
        } catch (e: any) {
            throw new ProcessingError(e.message);
        }
    }

    replaceLinks(html: string) {
        const proc = new InlineImageProcessor();
        html = html.replace(
            /<img.*?src="(.*?)".*?(alt="(.*?)")?.*?(title="(.*?)")?.*?>/g,
            (_match: string, src: string, _alt: string, _altText: string, _title: string, _titleText: string) => proc.render(src)
        );
        return html;
    }
}

export { MarkdownProcessor };
