/**
 * Based on https://github.com/dwengovzw/Learning-Object-Repository/blob/main/app/processors/markdown/learing_object_markdown_renderer.js [sic!]
 */
import PdfProcessor from '../pdf/pdf-processor.js';
import AudioProcessor from '../audio/audio-processor.js';
import ExternProcessor from '../extern/extern-processor.js';
import InlineImageProcessor from '../image/inline-image-processor.js';
import * as marked from 'marked';
import { getUrlStringForLearningObjectHTML, isValidHttpUrl } from '../../../../util/links';
import { ProcessingError } from '../processing-error';
import { LearningObjectIdentifier } from '../../../../interfaces/learning-content';
import { Language } from '../../../../entities/content/language';

import Image = marked.Tokens.Image;
import Heading = marked.Tokens.Heading;
import Link = marked.Tokens.Link;
import RendererObject = marked.RendererObject;

const prefixes = {
    learningObject: '@learning-object',
    pdf: '@pdf',
    audio: '@audio',
    extern: '@extern',
    video: '@youtube',
    notebook: '@notebook',
    blockly: '@blockly',
};

function extractLearningObjectIdFromHref(href: string): LearningObjectIdentifier {
    const [hruid, language, version] = href.split(/\/(.+)/, 2)[1].split('/');
    return {
        hruid,
        language: language as Language,
        version: parseInt(version),
    };
}

/**
 * An extension for the renderer of the Marked Markdown renderer which adds support for
 * - a custom heading,
 * - links to other learning objects,
 * - embeddings of other learning objects.
 */
const dwengoMarkedRenderer: RendererObject = {
    heading(heading: Heading): string {
        const text = heading.text;
        const level = heading.depth;
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        return (
            `<h${level}>\n` +
            `    <a name="${escapedText}" class="anchor" href="#${escapedText}">\n` +
            `        <span class="header-link"></span>\n` +
            `    </a>\n` +
            `    ${text}\n` +
            `</h${level}>\n`
        );
    },

    // When the syntax for a link is used => [text](href "title")
    // Render a custom link when the prefix for a learning object is used.
    link(link: Link): string {
        const href = link.href;
        const title = link.title || '';
        const text = marked.parseInline(link.text); // There could for example be an image in the link.

        if (href.startsWith(prefixes.learningObject)) {
            // Link to learning-object
            const learningObjectId = extractLearningObjectIdFromHref(href);
            return `<a href="${getUrlStringForLearningObjectHTML(learningObjectId)}" target="_blank" title="${title}">${text}</a>`;
        }
        // Any other link
        if (!isValidHttpUrl(href)) {
            throw new ProcessingError('Link is not a valid HTTP URL!');
        }
        //<a href="https://kiks.ilabt.imec.be/hub/tmplogin?id=0101" title="Notebooks Werking"><img src="Knop.png" alt="" title="Knop"></a>
        return `<a href="${href}" target="_blank" title="${title}">${text}</a>`;
    },

    // When the syntax for an image is used => ![text](href "title")
    // Render a learning object, pdf, audio or video if a prefix is used.
    image(img: Image): string {
        const href = img.href;
        if (href.startsWith(prefixes.learningObject)) {
            // Embedded learning-object
            const learningObjectId = extractLearningObjectIdFromHref(href);
            return `
                <learning-object hruid="${learningObjectId.hruid}" language="${learningObjectId.language}" version="${learningObjectId.version}"/>
            `; // Placeholder for the learning object since we cannot fetch its HTML here (this has to be a sync function!)
        } else if (href.startsWith(prefixes.pdf)) {
            // Embedded pdf
            const proc = new PdfProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1]);
        } else if (href.startsWith(prefixes.audio)) {
            // Embedded audio
            const proc = new AudioProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1]);
        } else if (href.startsWith(prefixes.extern) || href.startsWith(prefixes.video) || href.startsWith(prefixes.notebook)) {
            // Embedded youtube video or notebook (or other extern content)
            const proc = new ExternProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1]);
        }
        // Embedded image
        const proc = new InlineImageProcessor();
        return proc.render(href);
    },
};

export default dwengoMarkedRenderer;
