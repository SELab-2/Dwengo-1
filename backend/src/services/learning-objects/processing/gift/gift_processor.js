import Processor from "../processor.ts";
import { isValidHttpUrl } from '../../utils/utils.js'
import { findFile } from '../../utils/file_io.js'
import InvalidArgumentError from '../../utils/invalid_argument_error.js'
import DOMPurify from 'isomorphic-dompurify';
import ProcessingHistory from "../../models/processing_history.js";
import path from "path"
import fs from "fs"
import { parse } from "gift-pegjs"

class GiftProcessor extends Processor {

    constructor() {
        super();
        this.types = ["text/gift"]
    }

    /**
     *
     * @param {string} audioUrl
     * @param {object} args Optional arguments specific to the render function of the GiftProcessor
     * @returns
     */
    render(giftString, args = { }) {

        const quizQuestions = parse(giftString);
        console.log(quizQuestions);


        return DOMPurify.sanitize(`<audio controls>
                <source src="@@URL_REPLACE@@/>
                Your browser does not support the audio element.
                </audio>`);

    }

    processFiles(files, metadata){
        let inputString = "";
        let file  = files.find((f) => {
            let ext = path.extname(f.originalname);
            if (ext == ".txt") {
                inputString = f.buffer.toString('utf8');
                return true;
            }else{
                return false;
            }
        });
        return [this.render(inputString), files]
    }
}

export default GiftProcessor;
