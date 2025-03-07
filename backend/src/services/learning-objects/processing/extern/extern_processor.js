import Processor from "../processor.ts";
import { isValidHttpUrl } from '../../utils/utils.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import Logger from "../../logger.js";

let logger = Logger.getLogger()
class ExternProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     *
     * @param {string} externURL
     * @param {object} args Optional arguments specific to the render function of the ExternProcessor
     * @returns
     */
    render(externURL, {height = 315, aspect_ratio = 'iframe-16-9'} = {}) {
        if (!isValidHttpUrl(externURL)) {
            throw new InvalidArgumentError("The url is not valid: " + externURL);
        }

        // If a seperate youtube-processor would be added, this code would need to move to that processor
        // Converts youtube urls to youtube-embed urls
        let match = /(.*youtube.com\/)watch\?v=(.*)/.exec(externURL)
        if (match) {
            externURL = match[1] + "embed/" + match[2];
        }


        return DOMPurify.sanitize(`<div class="iframe-container ${aspect_ratio}"><iframe width="420px" height="${height}px" src="${externURL}" allowfullscreen></iframe></div>`, { ADD_TAGS: ["iframe"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']});

    }
}

export default ExternProcessor;
