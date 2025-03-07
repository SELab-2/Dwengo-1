import DOMPurify from 'isomorphic-dompurify'
import Processor from "../processor.ts"
import path from "path"

class TextProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     *
     * @param {string} plain text
     * @param {object} args Optional arguments
     * @returns
     */
    render(text, args = {}) {
        // Sanitize plain text to prevent xss.
        return DOMPurify.sanitize(text);
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

export default TextProcessor;
