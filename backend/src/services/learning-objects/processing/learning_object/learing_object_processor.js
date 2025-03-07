import Processor from "../processor.ts";



class LearningObjectProcessor extends Processor {
    constructor() {
        super();
    }

    /**
     *
     * @param {string} learningObjectId
     * @param {object} args Optional arguments
     * @returns
     */
    render(objectString, args = {}) {
        return `@@OBJECT_REPLACE/${objectString}@@`;
    }
}

export default LearningObjectProcessor;
