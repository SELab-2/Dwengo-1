import Processor from "../processor.ts";
import { isValidHttpUrl } from '../../utils/utils.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import ProcessingHistory from "../../models/processing_history.js";
import path from "path"

class InlineImageProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     *
     * @param {string} imageUrl
     * @param {object} args Optional arguments specific to the render function of the InlineImageProcessor
     * @returns
     */
    render(imageUrl, args = { altText: "", metadata: {} }) {

        if (!isValidHttpUrl(imageUrl) && (!imageUrl || !imageUrl.toLowerCase().match(/^(?!http.*$)[^.].*\.(jpe?g|png|svg|gif)/))) {
            if (args.metadata && args.metadata.hruid && args.metadata.version && args.metadata.language){
                ProcessingHistory.error(args.metadata.hruid, args.metadata.version, args.metadata.language, "The image cannot be found. Please check if the url is spelled correctly.")
            }else{
                ProcessingHistory.error("generalError", "99999999", "en", "The image cannot be found. Please check if the url is spelled correctly.")
            }
            throw new InvalidArgumentError("The image cannot be found. Please check if the url is spelled correctly.");
        }

        if (typeof args.altText == 'undefined') {
            args.altText = "";
        }

        if (isValidHttpUrl(imageUrl)) {
            return DOMPurify.sanitize(`<img src="${imageUrl}" alt="${args.altText}">`);

        }

        if (!args.metadata._id) {
            throw new InvalidArgumentError("The metadata for for the object which uses the file '" + imageUrl + "' is not loaded in the processor.");
        }
        return DOMPurify.sanitize(`<img src="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_NAME}/${args.metadata._id}/${imageUrl}" alt="${args.altText}">`);
    }

    processFiles(files, metadata){
        let args = {};
        let inputString = "";
        let file  = files.find((f) => {
            let ext = path.extname(f.originalname);
            if (ext.match(/\.(jpe?g)|(png)|(svg)$/)){
                inputString = f["originalname"];
                args.metadata = metadata
                return true;
            }else{
                return false;
            }
        });
        return [this.render(inputString, args), files]
    }
}

export default InlineImageProcessor;
