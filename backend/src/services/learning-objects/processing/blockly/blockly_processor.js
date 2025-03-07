import Processor from "../processor.ts";
import { isValidHttpUrl } from '../../utils/utils.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import Logger from "../../logger.js";
import path from "path"

let logger = Logger.getLogger()
class BlocklyProcessor extends Processor {
    constructor() {
        super();
        this.blockly_base_url  = process.env.SIMULATOR_READONLY_BASE_PATH;
    }

    /**
     *
     * @param {string} blocklyXml
     * @param {object} args Optional arguments specific to the render function of the BlocklyProcessor
     * @returns
     */
    render(blocklyXml, args = { language: "nl", id: "" }, {height = 315, aspect_ratio = 'iframe-16-9'} = {}) {
        if (!args.language || args.language.trim() == "") {
            args.language = "nl";
        }
        if (!args.id || args.id.trim() == "") {
            throw new InvalidArgumentError("The unique object id must be passed to the blockly processor.");
        }
        let languages = ["aa", "ab", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae", "ay", "az", "ba", "bm", "eu", "be", "bn", "bh", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "zh", "cu", "cv", "kw", "co", "cr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "fy", "ff", "ka", "de", "gd", "ga", "gl", "gv", "el", "gn", "gu", "ht", "ha", "he", "hz", "hi", "ho", "hr", "hu", "ig", "is", "io", "ii", "iu", "ie", "ia", "id", "ik", "it", "jv", "ja", "kl", "kn", "ks", "kr", "kk", "km", "ki", "rw", "ky", "kv", "kg", "ko", "kj", "ku", "lo", "la", "lv", "li", "ln", "lt", "lb", "lu", "lg", "mk", "mh", "ml", "mi", "mr", "ms", "mg", "mt", "mn", "na", "nv", "nr", "nd", "ng", "ne", "nn", "nb", "no", "ny", "oc", "oj", "or", "om", "os", "pa", "fa", "pi", "pl", "pt", "ps", "qu", "rm", "ro", "rn", "ru", "sg", "sa", "si", "sk", "sl", "se", "sm", "sn", "sd", "so", "st", "es", "sc", "sr", "ss", "su", "sw", "sv", "ty", "ta", "tt", "te", "tg", "tl", "th", "bo", "ti", "to", "tn", "ts", "tk", "tr", "tw", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "cy", "wa", "wo", "xh", "yi", "yo", "za", "zu"];
        if (!languages.includes(args.language)) {
            throw new InvalidArgumentError("The language must be valid. " + args.language + " is not a supported language.")
        }
        if (typeof blocklyXml == 'undefined') {
            throw new InvalidArgumentError("The blockly XML is undefined. Please provide correct XML code.")
        }

        let simulatorUrl = `${this.blockly_base_url}`

        let form  = `
        <form action="${simulatorUrl}" method="post" id="blockly_form_${args.id}" target="blockly_iframe_${args.id}">
            <input name="xml" type="hidden" value='${blocklyXml}'>
        </form>
        `

        let iframe = `
        <div class="iframe-container ${aspect_ratio}"><iframe name="blockly_iframe_${args.id}" height="530px" width="420px" allowfullscreen></iframe></div>
        `

        let code = `(function(){
            var auto = setTimeout(function(){ submitform(); }, 50);

            function submitform(){
              document.forms["blockly_form_${args.id}"].submit();
            }
        })()
        `

        let script = `<script>${code}</script>`

        let html = form + iframe // DOMPurify.sanitize(form + iframe, {ALLOW_UNKNOWN_PROTOCOLS: true, ADD_TAGS: ["iframe", "xml"], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target']});
        html = html + script;

        return html; //TODO is not sanitized using DOMPurify.sanitize (problems with script tags)
    }

    processFiles(files, metadata){
        let args = {}
        let inputString = "";
        let file  = files.find((f) => {
            let ext = path.extname(f.originalname);
            if (ext == ".xml") {
                inputString = f.buffer.toString('utf8');
                args.language = metadata.language;
                args.id = metadata._id;
                return true;
            }else{
                return false;
            }
        });
        return [this.render(inputString, args), files]
    }
}

export default BlocklyProcessor;
