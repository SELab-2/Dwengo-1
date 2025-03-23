/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/audio/audio_processor.js
 *
 * WARNING: The support for audio learning objects is currently still experimental.
 */

import DOMPurify from 'isomorphic-dompurify';
import { type } from 'node:os';
import { DwengoContentType } from '../content-type.js';
import { StringProcessor } from '../string-processor.js';

class AudioProcessor extends StringProcessor {
    constructor() {
        super(DwengoContentType.AUDIO_MPEG);
    }

    override renderFn(audioUrl: string): string {
        return DOMPurify.sanitize(`<audio controls>
            <source src="${audioUrl}" type=${type}>
            Your browser does not support the audio element.
            </audio>`);
    }
}

export default AudioProcessor;
