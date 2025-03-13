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
        let html = '';
        try {
            marked.use({ renderer: dwengoMarkedRenderer });
            html = marked(mdText, { async: false });
            html = this.replaceLinks(html); // Replace html image links path
        } catch (e: any) {
            throw new ProcessingError(e.message);
        }
        return html;
    }

    replaceLinks(html: string) {
        const proc = new InlineImageProcessor();
        html = html.replace(
            /<img.*?src="(.*?)".*?(alt="(.*?)")?.*?(title="(.*?)")?.*?>/g,
            (match: string, src: string, alt: string, altText: string, title: string, titleText: string) => proc.render(src)
        );
        return html;
    }
}

export { MarkdownProcessor };
