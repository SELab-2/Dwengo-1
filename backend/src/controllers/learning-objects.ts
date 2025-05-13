import { Request, Response } from 'express';
import { FALLBACK_LANG } from '../config.js';
import learningObjectService from '../services/learning-objects/learning-object-service.js';
import { Language } from '@dwengo-1/common/util/language';
import attachmentService from '../services/learning-objects/attachment-service.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { envVars, getEnvVar } from '../util/envVars.js';
import { FilteredLearningObject, LearningObjectIdentifierDTO, LearningPathIdentifier } from '@dwengo-1/common/interfaces/learning-content';
import { UploadedFile } from 'express-fileupload';
import { AuthenticatedRequest } from '../middleware/auth/authenticated-request';

function getLearningObjectIdentifierFromRequest(req: Request): LearningObjectIdentifierDTO {
    if (!req.params.hruid) {
        throw new BadRequestException('HRUID is required.');
    }
    return {
        hruid: req.params.hruid,
        language: (req.query.language || getEnvVar(envVars.FallbackLanguage)) as Language,
        version: parseInt(req.query.version as string),
    };
}

function getLearningPathIdentifierFromRequest(req: Request): LearningPathIdentifier {
    if (!req.query.hruid) {
        throw new BadRequestException('HRUID is required.');
    }
    return {
        hruid: req.params.hruid,
        language: (req.query.language as Language) || FALLBACK_LANG,
    };
}

export async function getAllLearningObjects(req: Request, res: Response): Promise<void> {
    if (req.query.admin) {
        // If the admin query parameter is present, the user wants to have all learning objects with this admin.
        const learningObjects = await learningObjectService.getLearningObjectsAdministratedBy(req.query.admin as string);

        res.json(learningObjects);
    } else {
        // Else he/she wants all learning objects on the path specified by the request parameters.
        const learningPathId = getLearningPathIdentifierFromRequest(req);
        const full = req.query.full;

        let learningObjects: FilteredLearningObject[] | string[];
        if (full) {
            learningObjects = await learningObjectService.getLearningObjectsFromPath(learningPathId);
        } else {
            learningObjects = await learningObjectService.getLearningObjectIdsFromPath(learningPathId);
        }

        res.json({ learningObjects: learningObjects });
    }
}

export async function getLearningObject(req: Request, res: Response): Promise<void> {
    const learningObjectId = getLearningObjectIdentifierFromRequest(req);

    const learningObject = await learningObjectService.getLearningObjectById(learningObjectId);

    if (!learningObject) {
        throw new NotFoundException('Learning object not found');
    }

    res.json(learningObject);
}

export async function getLearningObjectHTML(req: Request, res: Response): Promise<void> {
    const learningObjectId = getLearningObjectIdentifierFromRequest(req);

    const learningObject = await learningObjectService.getLearningObjectHTML(learningObjectId);
    res.send(learningObject);
}

export async function getAttachment(req: Request, res: Response): Promise<void> {
    const learningObjectId = getLearningObjectIdentifierFromRequest(req);
    const name = req.params.attachmentName;
    const attachment = await attachmentService.getAttachment(learningObjectId, name);

    if (!attachment) {
        throw new NotFoundException(`Attachment ${name} not found`);
    }
    res.setHeader('Content-Type', attachment.mimeType).send(attachment.content);
}

export async function handlePostLearningObject(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.files || !req.files.learningObject) {
        throw new BadRequestException('No file uploaded');
    }
    const learningObject = await learningObjectService.storeLearningObject((req.files.learningObject as UploadedFile).tempFilePath, [
        req.auth!.username,
    ]);
    res.json(learningObject);
}

export async function handleDeleteLearningObject(req: AuthenticatedRequest, res: Response): Promise<void> {
    const learningObjectId = getLearningObjectIdentifierFromRequest(req);

    if (!learningObjectId.version) {
        throw new BadRequestException('When deleting a learning object, a version must be specified.');
    }

    const deletedLearningObject = await learningObjectService.deleteLearningObject({
        hruid: learningObjectId.hruid,
        version: learningObjectId.version,
        language: learningObjectId.language,
    });
    if (deletedLearningObject) {
        res.json(deletedLearningObject);
    } else {
        throw new NotFoundException('Learning object not found');
    }
}
