import {describe, expect, it} from "vitest";
import mdExample from "../../../test-assets/learning-objects/pn-werkingnotebooks/pn-werkingnotebooks-example";
import multipleChoiceExample from "../../../test-assets/learning-objects/test-multiple-choice/test-multiple-choice-example";
import essayExample from "../../../test-assets/learning-objects/test-essay/test-essay-example";
import processingService from "../../../../src/services/learning-objects/processing/processing-service";

describe("ProcessingService", () => {
    it("renders a markdown learning object correctly", async () => {
        const markdownLearningObject = mdExample.createLearningObject();
        const result = await processingService.render(markdownLearningObject);
        expect(result).toEqual(mdExample.getHTMLRendering());
    });

    it("renders a multiple choice question correctly", async () => {
        const multipleChoiceLearningObject = multipleChoiceExample.createLearningObject();
        const result = await processingService.render(multipleChoiceLearningObject);
        expect(result).toEqual(multipleChoiceExample.getHTMLRendering());
    });

    it("renders an essay question correctly", async () => {
        const essayLearningObject = essayExample.createLearningObject();
        const result = await processingService.render(essayLearningObject);
        expect(result).toEqual(essayExample.getHTMLRendering());
    });
});
