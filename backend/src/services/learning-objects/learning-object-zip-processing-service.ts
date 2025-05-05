import unzipper from 'unzipper';
import mime from 'mime-types';
import {LearningObject} from "../../entities/content/learning-object.entity";
import {getAttachmentRepository, getLearningObjectRepository} from "../../data/repositories";
import {BadRequestException} from "../../exceptions/bad-request-exception";
import {LearningObjectMetadata} from "@dwengo-1/common/dist/interfaces/learning-content";

/**
 * Process an uploaded zip file and construct a LearningObject from its contents.
 * @param filePath Path of the zip file to process.
 */
export async function processLearningObjectZip(filePath: string): Promise<LearningObject> {
    const learningObjectRepo = getLearningObjectRepository();
    const attachmentRepo = getAttachmentRepository();

    const zip = await unzipper.Open.file(filePath);

    let metadata: LearningObjectMetadata | null = null;
    const attachments: {name: string, content: Buffer}[] = [];
    let content: Buffer | null = null;

    for (const file of zip.files) {
        if (file.type === "Directory") {
            throw new BadRequestException("The learning object zip file should not contain directories.");
        } else if (file.path === "metadata.json") {
            metadata = await processMetadataJson(file);
        } else if (file.path.startsWith("index.")) {
            content = await processFile(file);
        } else {
            attachments.push({
                name: file.path,
                content: await processFile(file)
            });
        }
    }

    if (!metadata) {
        throw new BadRequestException("Missing metadata.json file");
    }
    if (!content) {
        throw new BadRequestException("Missing index file");
    }

    const learningObject = learningObjectRepo.create(metadata);
    const attachmentEntities = attachments.map(it => attachmentRepo.create({
        name: it.name,
        content: it.content,
        mimeType: mime.lookup(it.name) || "text/plain",
        learningObject
    }))
    learningObject.attachments.push(...attachmentEntities);

    return learningObject;
}

async function processMetadataJson(file: unzipper.File): LearningObjectMetadata {
    const buf = await file.buffer();
    const content = buf.toString();
    return JSON.parse(content);
}

async function processFile(file: unzipper.File): Promise<Buffer> {
    return await file.buffer();
}
