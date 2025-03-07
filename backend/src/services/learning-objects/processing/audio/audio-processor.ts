/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/audio/audio_processor.js
 */
import Processor from "../processor.js";
import DOMPurify from 'isomorphic-dompurify';
import {type} from "node:os";
import {DwengoContentType} from "../content-type";

class AudioProcessor extends Processor<string> {

    constructor() {
        super(DwengoContentType.AUDIO_MPEG);
    }

    protected renderFn(audioUrl: string): string {
        return DOMPurify.sanitize(`<audio controls>
            <source src="${audioUrl}" type=${type}>
            Your browser does not support the audio element.
            </audio>`);
    }
}

export default AudioProcessor;
