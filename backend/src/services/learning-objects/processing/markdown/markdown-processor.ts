/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/markdown/markdown_processor.js
 */

import { marked } from 'marked';
import InlineImageProcessor from '../image/inline-image-processor.js';
import { DwengoContentType } from '../content-type.js';
import dwengoMarkedRenderer from './dwengo-marked-renderer.js';
import { StringProcessor } from '../string-processor.js';
import { ProcessingError } from '../processing-error.js';
import { YAMLException } from 'js-yaml';

class MarkdownProcessor extends StringProcessor {
    constructor() {
        super(DwengoContentType.TEXT_MARKDOWN);
    }

    static replaceLinks(html: string): string {
        const proc = new InlineImageProcessor();
        html = html.replace(
            /<img.*?src="(.*?)".*?(alt="(.*?)")?.*?(title="(.*?)")?.*?>/g,
            (_match: string, src: string, _alt: string, _altText: string, _title: string, _titleText: string) => proc.render(src)
        );
        return html;
    }

    override renderFn(mdText: string): string {
        try {
            marked.use({ renderer: dwengoMarkedRenderer });
            const html = marked(mdText, { async: false });
            return MarkdownProcessor.replaceLinks(html); // Replace html image links path
        } catch (e: unknown) {
            if (e instanceof YAMLException) {
                throw new ProcessingError(e.message);
            }

            throw new ProcessingError('Unknown error while processing markdown: ' + e);
        }
    }
}

export { MarkdownProcessor };
