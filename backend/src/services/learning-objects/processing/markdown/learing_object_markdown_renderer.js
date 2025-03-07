import LearningObjectProcessor from "../learning_object/learing_object_processor.js";
import PdfProcessor from "../pdf/pdf_processor.js";
import AudioProcessor from "../audio/audio_processor.js";
import ExternProcessor from "../extern/extern_processor.js";
import BlocklyProcessor from "../blockly/blockly_processor.js";
import { findFile } from "../../utils/file_io.js";
import InlineImageProcessor from "../image/inline_image_processor.js";
import { isValidHttpUrl } from "../../utils/utils.js";
import ProcessingHistory from "../../models/processing_history.js";

class LearningObjectMarkdownRenderer {
    learingObjectPrefix = '@learning-object';
    pdfPrefix = '@pdf';
    audioPrefix = '@audio';
    externPrefix = '@extern';
    videoPrefix = '@youtube';
    notebookPrefix = '@notebook';
    blocklyPrefix = '@blockly';

    constructor(args = { files: [], metadata: {} }) {
        this.args = args;
    }

    heading(text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        return `
                <h${level}>
                    <a name="${escapedText}" class="anchor" href="#${escapedText}">
                    <span class="header-link"></span>
                    </a>
                    ${text}
                </h${level}>`;
    };

    // When the syntax for a link is used => [text](href "title")
    // render a custom link when the prefix for a learning object is used.
    link(href, title, text) {
        if (href.startsWith(this.learingObjectPrefix)) {
            // link to learning-object
            let query = href.split(/\/(.+)/, 2)[1].split("/")
            return `<a href="@@URL_REPLACE@@/api/learningObject/getRaw?hruid=${query[0]}&language=${query[1]}&version=${query[2]}&redirect=true" target="_blank" title="${title}">${text}</a>`
        } else if (href.startsWith(this.blocklyPrefix)) {
            // link to blockly (downloads)
            if (title) {
                return `<a href="@@URL_REPLACE@@/api/learningObject/downloadFile/${process.env.LEARNING_OBJECT_STORAGE_NAME}/${this.args.metadata._id}/${href.split(/\/(.+)/, 2)[1]}" target="_blank" title="${title}">${text}</a>`
            }
            return `<a href="@@URL_REPLACE@@/api/learningObject/downloadFile/${process.env.LEARNING_OBJECT_STORAGE_NAME}/${this.args.metadata._id}/${href.split(/\/(.+)/, 2)[1]}" target="_blank">${text}</a>`
        } else {
            // any other link
            if (isValidHttpUrl(href)) {
                return `<a href="${href}" target="_blank" title="${title}">${text}</a>`;
            } else {
                if (title) {
                    return `<a href="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_NAME}/${this.args.metadata._id}/${href}" target="_blank" title="${title}">${text}</a>`
                }
                return `<a href="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_NAME}/${this.args.metadata._id}/${href}" target="_blank" >${text}</a>`
            }
        }
    };

    // When the syntax for an image is used => ![text](href "title")
    // render a learning object, pdf, audio or video if a prefix is used.
    image(href, title, text) {
        if (href.startsWith(this.learingObjectPrefix)) {
            // embedded learning-object
            let proc = new LearningObjectProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1]);

        } else if (href.startsWith(this.pdfPrefix)) {
            // embedded pdf
            let proc = new PdfProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1], { files: this.args.files, metadata: this.args.metadata });

        } else if (href.startsWith(this.audioPrefix)) {
            // embedded audio
            let proc = new AudioProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1], { files: this.args.files, metadata: this.args.metadata });

        } else if (href.startsWith(this.externPrefix) || href.startsWith(this.videoPrefix) || href.startsWith(this.notebookPrefix)) {
            // embedded youtube video or notebook (or other extern content)
            let proc = new ExternProcessor();
            return proc.render(href.split(/\/(.+)/, 2)[1]);

        } else if (href.startsWith(this.blocklyPrefix)) {
            // embedded blockly program
            let proc = new BlocklyProcessor();
            if (this.args.files) {
                let file = findFile(href.split(/\/(.+)/, 2)[1], this.args.files)
                if (file) {
                    return proc.render(file.buffer, { language: this.args.metadata.language ? this.args.metadata.language : "nl", id: this.args.metadata._id });
                }

            }
            ProcessingHistory.error("generalError", "99999999", "en", `"The blockly preview with reference ${href} could not be loaded. Are you sure the correct xml file was passed?`)
            return "";
        }/*else if (href.startsWith(this.learingObjectPrefix)){
            let [hruid, version, language] = href.split(/\/(.+)/, 2)[1].split("/")
            return learningObjectApiController.getHtmlObject({hruid: hruid, version: version, language: language})
        }*/ else {
            // embedded image
            let proc = new InlineImageProcessor();
            return proc.render(href, { metadata: this.args.metadata })
        }
    };

}

export default LearningObjectMarkdownRenderer