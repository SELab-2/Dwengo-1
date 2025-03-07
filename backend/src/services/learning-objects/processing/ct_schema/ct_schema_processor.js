import Logger from '../../logger.js';
import InvalidArgumentError from "../../utils/invalid_argument_error.js";
import { MarkdownProcessor } from '../markdown/markdown_processor.js';

class CTSchemaProcessor extends MarkdownProcessor{
    logger = Logger.getLogger();
    constructor(args = { files: [], metadata: {} }) {
        super();
        this.staticPath = `${process.env.DOMAIN_URL}${process.env.STATIC_BASE_PATH}/img/ct_schema/`;
    }

    /**
     * 
     * @param {string} mdText a string containing the content for the four ct schema in markdown
     * @returns The sanitized version of the generated html.
     */
    render(text, args = {}) {
        let html = ""; 
        // 1. Split text into markdown parts for each CT aspect
        // 2. Call super.render on the individual parts
        // 3. Group the parts together with specific html structure

        const regexObject = {
            context: /<context>([\s\S]*?)<\/context>/,
            decomp: /<decomposition>([\s\S]*?)<\/decomposition>/,
            abstr: /<abstraction>([\s\S]*?)<\/abstraction>/,
            pattern: /<patternRecognition>([\s\S]*?)<\/patternRecognition>/,
            algo: /<algorithms>([\s\S]*?)<\/algorithms>/,
            impl: /<implementation>([\s\S]*?)<\/implementation>/,
        }

        let htmlObject = {}
        
        let htmlStructure = (valueObject) => `
        <div class="ct_schema_container">
            <div class="ct_context_container">${valueObject.context}</div>
            <div class="ct_row1_container">
                <div class="ct_decomposition_container">${valueObject.decomp}<div class="ct_logo"><img src="${this.staticPath + "decompositie.png"}"/></div></div>
                <div class="ct_pattern_recognition_container">${valueObject.pattern}<div class="ct_logo"><img src="${this.staticPath + "patroonherkenning.png"}"/></div></div>
            </div>
            <div class="ct_row2_container">
                <div class="ct_abstraction_container">${valueObject.abstr}<div class="ct_logo"><img src="${this.staticPath + "abstractie.png"}"/></div></div>
                <div class="ct_algorithm_container">${valueObject.algo}<div class="ct_logo"><img src="${this.staticPath + "algoritme.png"}"/></div></div>
            </div>
            <div class="ct_implementation_container">${valueObject.impl}<div class="ct_logo"><img src="${this.staticPath + "decompositie.png"}"/></div></div>
        </div>`

        try {
            for (let key in regexObject) {
                let match = text.match(regexObject[key]);
                if (match && match.length >= 1){
                    htmlObject[key] = super.render(match[1]);
                }else{
                    htmlObject[key] = "";
                }
            }
        } catch (e) {
            throw new InvalidArgumentError(e.message);
            return ""
        }
        return htmlStructure(htmlObject);
    }

}


export { CTSchemaProcessor };