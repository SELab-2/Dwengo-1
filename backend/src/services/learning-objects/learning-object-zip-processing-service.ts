import unzipper from 'unzipper';
import mime from 'mime-types';
import {LearningObject} from "../../entities/content/learning-object.entity";
import {getAttachmentRepository, getLearningObjectRepository} from "../../data/repositories";
import {BadRequestException} from "../../exceptions/bad-request-exception";
import {LearningObjectMetadata} from "@dwengo-1/common/dist/interfaces/learning-content";
import { ReturnValue } from '../../entities/content/return-value.entity';

const METADATA_PATH_REGEX = /.*[/^]metadata\.json$/;
const CONTENT_PATH_REGEX = /.*[/^]content\.[a-zA-Z]*$/;

/**
 * Process an uploaded zip file and construct a LearningObject from its contents.
 * @param filePath Path of the zip file to process.
 */
export async function processLearningObjectZip(filePath: string): Promise<LearningObject> {
    let zip: unzipper.CentralDirectory;
    try {
        zip = await unzipper.Open.file(filePath);
    } catch(_: unknown) {
        throw new BadRequestException("invalidZip");
    }


    let metadata: LearningObjectMetadata | undefined = undefined;
    const attachments: {name: string, content: Buffer}[] = [];
    let content: Buffer | undefined = undefined;

    if (zip.files.length === 0) {
        throw new BadRequestException("emptyZip")
    }

    await Promise.all(
        zip.files.map(async file => {
            if (file.type !== "Directory") {
                if (METADATA_PATH_REGEX.test(file.path)) {
                    metadata = await processMetadataJson(file);
                } else if (CONTENT_PATH_REGEX.test(file.path)) {
                    content = await processFile(file);
                } else {
                    attachments.push({
                        name: file.path,
                        content: await processFile(file)
                    });
                }
            }
        })
    );

    if (!metadata) {
        throw new BadRequestException("missingMetadata");
    }
    if (!content) {
        throw new BadRequestException("missingIndex");
    }


    const learningObject = createLearningObject(metadata, content, attachments);

    return learningObject;
}

function createLearningObject(
    metadata: LearningObjectMetadata, content: Buffer, attachments: { name: string; content: Buffer; }[]
): LearningObject {
    const learningObjectRepo = getLearningObjectRepository();
    const attachmentRepo = getAttachmentRepository();
    const learningObject = learningObjectRepo.create({
        admins: [],
        available: metadata.available ?? true,
        content: content,
        contentType: metadata.content_type,
        copyright: metadata.copyright ?? "",
        description: metadata.description ?? "",
        educationalGoals: metadata.educational_goals ?? [],
        hruid: metadata.hruid,
        keywords: metadata.keywords,
        language: metadata.language,
        license: metadata.license ?? "",
        returnValue: metadata.return_value ?? new ReturnValue(),
        skosConcepts: metadata.skos_concepts ?? [],
        teacherExclusive: metadata.teacher_exclusive,
        title: metadata.title,
        version: metadata.version
    });
    const attachmentEntities = attachments.map(it => attachmentRepo.create({
        name: it.name,
        content: it.content,
        mimeType: mime.lookup(it.name) || "text/plain",
        learningObject
    }));
    attachmentEntities.forEach(it => { learningObject.attachments.add(it); });
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
