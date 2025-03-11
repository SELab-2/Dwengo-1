/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/extern/extern_processor.js
 *
 * WARNING: The support for external content is currently still experimental.
 */

import DOMPurify from 'isomorphic-dompurify';
import {ProcessingError} from "../processing-error";
import {isValidHttpUrl} from "../../../../util/links";
import {DwengoContentType} from "../content-type";
import {StringProcessor} from "../string-processor";

class ExternProcessor extends StringProcessor {
    constructor() {
        super(DwengoContentType.EXTERN);
    }

    override renderFn(externURL: string) {
        if (!isValidHttpUrl(externURL)) {
            throw new ProcessingError("The url is not valid: " + externURL);
        }

        // If a seperate youtube-processor would be added, this code would need to move to that processor
        // Converts youtube urls to youtube-embed urls
        const match = /(.*youtube.com\/)watch\?v=(.*)/.exec(externURL)
        if (match) {
            externURL = match[1] + "embed/" + match[2];
        }

        return DOMPurify.sanitize(`
            <div class="iframe-container">
                <iframe src="${externURL}" allowfullscreen></iframe>
            </div>`,
            { ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']}
        );

    }
}

export default ExternProcessor;
