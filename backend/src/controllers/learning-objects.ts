import { Request, Response } from 'express';
import { FALLBACK_LANG } from '../config.js';
import learningObjectService from '../services/learning-objects/learning-object-service.js';
import { Language } from '@dwengo-1/common/util/language';
import attachmentService from '../services/learning-objects/attachment-service.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { envVars, getEnvVar } from '../util/envVars.js';
import {
    FilteredLearningObject,
    LearningObjectIdentifier,
    LearningPathIdentifier
} from "@dwengo-1/common/interfaces/learning-content";

function getLearningObjectIdentifierFromRequest(req: Request): LearningObjectIdentifier {
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
