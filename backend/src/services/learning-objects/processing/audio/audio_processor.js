/**
 * Based on
 */
import Processor from "../processor.ts";
import { isValidHttpUrl } from '../../utils/utils.js'
import { findFile } from '../../utils/file_io.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import ProcessingHistory from "../../models/processing_history.js";
import path from "path"
import fs from "fs"

class AudioProcessor extends Processor {

    constructor() {
        super();
        this.types = ["audio/mpeg"] // TODO add functionality to accept other audio types (ogg, wav)
    }

    /**
     *
     * @param {string} audioUrl
     * @param {object} args Optional arguments specific to the render function of the AudioProcessor
     * @returns
     */
    render(audioUrl, args = { files: [], metadata: {} }) {

        if ((!args.files || args.files.length <= 0 || !findFile(audioUrl, args.files)) && !isValidHttpUrl(audioUrl)) {
            if (args.metadata && args.metadata.hruid && args.metadata.version && args.metadata.language){
                ProcessingHistory.error(args.metadata.hruid, args.metadata.version, args.metadata.language, "The audio file cannot be found. Please check if the url is spelled correctly.")
            }else{
                ProcessingHistory.error("generalError", "99999999", "en", "The audio file cannot be found. Please check if the url is spelled correctly.")
            }

            throw new InvalidArgumentError("The audio file cannot be found. Please check if the url is spelled correctly.");
        }

        let type;
        if (!args.metadata || !args.metadata.content_type || !this.types.includes(args.metadata.content_type)) {
            type = this.types[0];
        } else {
            type = args.metadata.content_type;
        }

        if (isValidHttpUrl(audioUrl)) {
            return DOMPurify.sanitize(`<audio controls>
                <source src="${audioUrl}" type=${type}>
                Your browser does not support the audio element.
                </audio>`);
        }

        if (!args.metadata._id) {
            throw new InvalidArgumentError("The metadata for for the object which uses the file '" + audioUrl + "' is not loaded in the processor.");
        }

        return DOMPurify.sanitize(`<audio controls>
                <source src="@@URL_REPLACE@@/${process.env.LEARNING_OBJECT_STORAGE_NAME}/${args.metadata._id}/${audioUrl}" type=${type}>
                Your browser does not support the audio element.
                </audio>`);

    }

    processFiles(files, metadata){
        let args = {}
        let inputString = "";
        let file  = files.find((f) => {
            let ext = path.extname(f.originalname);
            if (ext == ".mp3") {
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

export default AudioProcessor;
