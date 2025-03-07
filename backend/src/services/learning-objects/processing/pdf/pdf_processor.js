import Processor from "../processor.ts";
import { isValidHttpUrl } from '../../utils/utils.js'
import { findFile } from '../../utils/file_io.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import ProcessingHistory from "../../models/processing_history.js";
import path from "path"

class PdfProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     *
     * @param {string} pdfUrl
     * @param {object} args Optional arguments specific to the render function of the PdfProcessor
     * @returns
     */
    render(pdfUrl, args = { files: [], metadata: {} }) {
        if ((!args.files || args.files.length <= 0 || !findFile(pdfUrl, args.files)) && !isValidHttpUrl(pdfUrl)) {
            let errormessage = `The pdf file ${pdfUrl} cannot be found. Please check if the url is spelled correctly.`
            if (args.metadata && args.metadata.hruid && args.metadata.version && args.metadata.language){
                ProcessingHistory.error(args.metadata.hruid, args.metadata.version, args.metadata.language, errormessage)
            }else{
                ProcessingHistory.error("generalError", "99999999", "en", errormessage)
            }
            throw new InvalidArgumentError("The pdf file cannot be found. Please check if the url is spelled correctly.");
        }

        if (isValidHttpUrl(pdfUrl)) {
            return DOMPurify.sanitize(`<embed src="${pdfUrl}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })
        }

        if (!args.metadata || !args.metadata._id) {
            throw new InvalidArgumentError("The metadata for for the object which uses the file '" + pdfUrl + "' is not loaded in the processor.");
        }

        return DOMPurify.sanitize(`<embed src="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_NAME}/${args.metadata._id}/${pdfUrl}" type="application/pdf" width="100%" height="800px"/>`, { ADD_TAGS: ["embed"] })

    }


    processFiles(files, metadata){
        let args = {}
        let inputString = "";
        let file  = files.find((f) => {
            let ext = path.extname(f.originalname);
            if (ext == ".pdf") {
                inputString = f["originalname"]
                // add files to args to check if file exists
                args.files = files;
                args.metadata = metadata
                return true;
            }else{
                return false;
            }
        });
        return [this.render(inputString, args), files]
    }
}

export default PdfProcessor;
