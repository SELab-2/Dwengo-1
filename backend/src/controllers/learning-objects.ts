import { Request, Response } from 'express';
import { FALLBACK_LANG } from '../config.js';
import {FilteredLearningObject, LearningObjectIdentifier, LearningPathIdentifier} from '../interfaces/learning-content';
import learningObjectService from "../services/learning-objects/learning-object-service";
import {EnvVars, getEnvVar} from "../util/envvars";
import {Language} from "../entities/content/language";
import {BadRequestException} from "../exceptions";

function getLearningObjectIdentifierFromRequest(req: Request): LearningObjectIdentifier {
    if (!req.params.hruid) {
        throw new BadRequestException("HRUID is required.");
    }
    return {
        hruid: req.params.hruid as string,
        language: (req.query.language || getEnvVar(EnvVars.FallbackLanguage)) as Language,
        version: req.query.version as string
    };
}

function getLearningPathIdentifierFromRequest(req: Request): LearningPathIdentifier {
    if (!req.query.hruid) {
        throw new BadRequestException("HRUID is required.");
    }
    return {
        hruid: req.params.hruid as string,
        language: (req.query.language as Language) || FALLBACK_LANG
    }
}

export async function getAllLearningObjects(
    req: Request,
    res: Response
): Promise<void> {
    const learningPathId = getLearningPathIdentifierFromRequest(req);
    const full = req.query.full;

    let learningObjects: FilteredLearningObject[] | string[];
    if (full) {
        learningObjects = await learningObjectService.getLearningObjectsFromPath(learningPathId);
    } else {
        learningObjects = await learningObjectService.getLearningObjectIdsFromPath(learningPathId);
    }

    res.json(learningObjects);
}

export async function getLearningObject(
    req: Request,
    res: Response
): Promise<void> {
    const learningObjectId = getLearningObjectIdentifierFromRequest(req);

    const learningObject = await learningObjectService.getLearningObjectById(learningObjectId);
    res.json(learningObject);
}

export async function getLearningObjectHTML(req: Request, res: Response): Promise<void> {
    const learningObjectId = getLearningObjectIdentifierFromRequest(req);

    const learningObject = await learningObjectService.getLearningObjectHTML(learningObjectId);
    res.send(learningObject);
}
