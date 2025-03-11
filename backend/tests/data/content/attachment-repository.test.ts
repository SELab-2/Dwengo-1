import {beforeAll, describe, expect, it} from "vitest";
import {setupTestApp} from "../../setup-tests";
import {getAttachmentRepository, getLearningObjectRepository} from "../../../src/data/repositories";
import {AttachmentRepository} from "../../../src/data/content/attachment-repository";
import {LearningObjectRepository} from "../../../src/data/content/learning-object-repository";
import example from "../../test-assets/learning-objects/pn-werkingnotebooks/pn-werkingnotebooks-example";
import {LearningObject} from "../../../src/entities/content/learning-object.entity";
import {Attachment} from "../../../src/entities/content/attachment.entity";
import {LearningObjectIdentifier} from "../../../src/entities/content/learning-object-identifier";

const NEWER_TEST_SUFFIX = "nEweR";

function createTestLearningObjects(learningObjectRepo: LearningObjectRepository): {older: LearningObject, newer: LearningObject} {
    const olderExample = example.createLearningObject();
    learningObjectRepo.save(olderExample);

    const newerExample = example.createLearningObject();
    newerExample.title = "Newer example";
    newerExample.version = 100;

    return {
        older: olderExample,
        newer: newerExample,
    };
}

describe("AttachmentRepository", () => {
    let attachmentRepo: AttachmentRepository;
    let exampleLearningObjects: {older: LearningObject, newer: LearningObject};
    let attachmentsOlderLearningObject: Attachment[];

    beforeAll(async () => {
        await setupTestApp();
        attachmentRepo = getAttachmentRepository();
        exampleLearningObjects = createTestLearningObjects(getLearningObjectRepository());
    });

    it("can add attachments to learning objects without throwing an error", () => {
        attachmentsOlderLearningObject = Object
            .values(example.createAttachment)
            .map(fn => fn(exampleLearningObjects.older));

        for (const attachment of attachmentsOlderLearningObject) {
            attachmentRepo.save(attachment);
        }
    });

    let attachmentOnlyNewer: Attachment;
    it("allows us to add attachments with the same name to a different learning object without throwing an error", () => {
        attachmentOnlyNewer = Object.values(example.createAttachment)[0](exampleLearningObjects.newer);
        attachmentOnlyNewer.content.write(NEWER_TEST_SUFFIX);

        attachmentRepo.save(attachmentOnlyNewer);
    });

    let olderLearningObjectId: LearningObjectIdentifier;
    it("returns the correct attachment when queried by learningObjectId and attachment name", async () => {
        olderLearningObjectId = {
            hruid: exampleLearningObjects.older.hruid,
            language: exampleLearningObjects.older.language,
            version: exampleLearningObjects.older.version
        };

        const result = await attachmentRepo.findByLearningObjectIdAndName(
            olderLearningObjectId,
            attachmentsOlderLearningObject[0].name
        );
        expect(result).toBe(attachmentsOlderLearningObject[0]);
    });

    it("returns null when queried by learningObjectId and non-existing attachment name", async () => {
        const result = await attachmentRepo.findByLearningObjectIdAndName(
            olderLearningObjectId,
            "non-existing name"
        );
        expect(result).toBe(null);
    });

    it("returns the newer version of the attachment when only queried by hruid, language and attachment name (but not version)", async () => {
        const result = await attachmentRepo.findByMostRecentVersionOfLearningObjectAndName(
            exampleLearningObjects.older.hruid,
            exampleLearningObjects.older.language,
            attachmentOnlyNewer.name
        );
        expect(result).toBe(attachmentOnlyNewer);
    });
});
