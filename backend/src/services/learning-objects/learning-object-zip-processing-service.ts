import unzipper from 'unzipper';
import mime from 'mime-types';
import { LearningObject } from '../../entities/content/learning-object.entity.js';
import { getAttachmentRepository, getLearningObjectRepository } from '../../data/repositories.js';
import { BadRequestException } from '../../exceptions/bad-request-exception.js';
import { LearningObjectMetadata } from '@dwengo-1/common/interfaces/learning-content';
import { DwengoContentType } from './processing/content-type.js';
import { v4 } from 'uuid';

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
    } catch (_: unknown) {
        throw new BadRequestException('invalidZip');
    }

    let metadata: LearningObjectMetadata | undefined = undefined;
    const attachments: { name: string; content: Buffer }[] = [];
    let content: Buffer | undefined = undefined;

    if (zip.files.length === 0) {
        throw new BadRequestException('emptyZip');
    }

    await Promise.all(
        zip.files.map(async (file) => {
            if (file.type !== 'Directory') {
                if (METADATA_PATH_REGEX.test(file.path)) {
                    metadata = await processMetadataJson(file);
                } else if (CONTENT_PATH_REGEX.test(file.path)) {
                    content = await processFile(file);
                } else {
                    attachments.push({
                        name: file.path,
                        content: await processFile(file),
                    });
                }
            }
        })
    );

    if (!metadata) {
        throw new BadRequestException('missingMetadata');
    }
    if (!content) {
        throw new BadRequestException('missingIndex');
    }

    const learningObject = createLearningObject(metadata, content, attachments);

    return learningObject;
}

function createLearningObject(metadata: LearningObjectMetadata, content: Buffer, attachments: { name: string; content: Buffer }[]): LearningObject {
    const learningObjectRepo = getLearningObjectRepository();
    const attachmentRepo = getAttachmentRepository();

    const returnValue = {
        callbackUrl: metadata.return_value?.callback_url ?? '',
        callbackSchema: metadata.return_value?.callback_schema ? JSON.stringify(metadata.return_value.callback_schema) : '',
    };

    if (!metadata.target_ages || metadata.target_ages.length === 0) {
        throw new BadRequestException("errorTargetAgesMandatory");
    }

    const learningObject = learningObjectRepo.create({
        admins: [],
        available: metadata.available ?? true,
        content: content,
        contentType: metadata.content_type as DwengoContentType,
        copyright: metadata.copyright ?? '',
        description: metadata.description ?? '',
        educationalGoals: metadata.educational_goals ?? [],
        hruid: metadata.hruid,
        keywords: metadata.keywords,
        language: metadata.language,
        license: metadata.license ?? '',
        returnValue,
        skosConcepts: metadata.skos_concepts ?? [],
        teacherExclusive: metadata.teacher_exclusive,
        title: metadata.title,
        version: metadata.version,
        estimatedTime: metadata.estimated_time ?? 1,
        targetAges: metadata.target_ages ?? [],
        difficulty: metadata.difficulty ?? 1,
        uuid: v4()
    });
    const attachmentEntities = attachments.map((it) =>
        attachmentRepo.create({
            name: it.name,
            content: it.content,
            mimeType: mime.lookup(it.name) || 'text/plain',
            learningObject,
        })
    );
    attachmentEntities.forEach((it) => {
        learningObject.attachments.add(it);
    });
    return learningObject;
}

async function processMetadataJson(file: unzipper.File): Promise<LearningObjectMetadata> {
    const buf = await file.buffer();
    const content = buf.toString();
    return JSON.parse(content);
}

async function processFile(file: unzipper.File): Promise<Buffer> {
    return await file.buffer();
}
