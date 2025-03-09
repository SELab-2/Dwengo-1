/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/markdown/markdown_processor.js
 */

import {marked} from 'marked'
import Processor from '../processor.js';
import InlineImageProcessor from '../image/inline-image-processor.js';
import {DwengoContentType} from "../content-type";
import {ProcessingError} from "../processing-error";
import dwengoMarkedRenderer from "./dwengo-marked-renderer";

class MarkdownProcessor extends Processor<string> {
    constructor() {
        super(DwengoContentType.TEXT_MARKDOWN);
    }

    override renderFn(mdText: string) {
        let html = "";
        try {
            mdText = this.replaceLinks(mdText); // Replace html image links with path based on metadata
            marked.use({renderer: dwengoMarkedRenderer});
            html = marked(mdText, {async: false});
        } catch (e: any) {
            throw new ProcessingError(e.message);
        }
        return html;
    }

    replaceLinks(html: string) {
        let proc = new InlineImageProcessor();
        html = html.replace(/<img.*?src="(.*?)".*?(alt="(.*?)")?.*?(title="(.*?)")?.*?>/g, (
            match: string,
            src: string,
            alt: string,
            altText: string,
            title: string,
            titleText: string
        ) => {
            return proc.render(src);
        });
        return html;
    }
}

export { MarkdownProcessor };
