import {LearningObjectExample} from "../learning-object-example";
import {LearningObject} from "../../../../src/entities/content/learning-object.entity";
import {Language} from "../../../../src/entities/content/language";
import {loadTestAsset} from "../../../test-utils/load-test-asset";
import {DwengoContentType} from "../../../../src/services/learning-objects/processing/content-type";

/**
 * Create a dummy learning object to be used in tests where multiple learning objects are needed (for example for use
 * on a path), but where the precise contents of the learning object are not important.
 */
export function dummyLearningObject(hruid: string, language: Language, title: string): LearningObjectExample {
    return {
        createLearningObject: () => {
            const learningObject = new LearningObject();
            learningObject.hruid = hruid;
            learningObject.language = language;
            learningObject.version = 1;
            learningObject.title = title;
            learningObject.description = "Just a dummy learning object for testing purposes";
            learningObject.contentType = DwengoContentType.TEXT_PLAIN;
            learningObject.content = Buffer.from("Dummy content");
            return learningObject;
        },
        createAttachment: {},
        getHTMLRendering: () => loadTestAsset("learning-objects/dummy/rendering.html").toString()
    }
}
