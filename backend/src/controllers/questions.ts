import { Request, Response } from 'express';
import {
    createQuestion,
    deleteQuestion,
    getAllQuestions,
    getQuestion,
    getQuestionsAboutLearningObjectInAssignment,
    updateQuestion,
} from '../services/questions.js';
import { FALLBACK_LANG, FALLBACK_SEQ_NUM, FALLBACK_VERSION_NUM } from '../config.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { QuestionData, QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { Language } from '@dwengo-1/common/util/language';
import { requireFields } from './error-helper.js';

export function getLearningObjectId(hruid: string, version: string, lang: string): LearningObjectIdentifier {
    return {
        hruid,
        language: (lang || FALLBACK_LANG) as Language,
        version: Number(version) || FALLBACK_VERSION_NUM,
    };
}

export function getQuestionId(learningObjectIdentifier: LearningObjectIdentifier, seq: string): QuestionId {
    return {
        learningObjectIdentifier,
        sequenceNumber: seq ? Number(seq) : FALLBACK_SEQ_NUM,
    };
}

export async function getAllQuestionsHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = (req.query.lang ? req.query.lang : FALLBACK_LANG) as string;
    const full = req.query.full === 'true';
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);

    let questions: QuestionDTO[] | QuestionId[];
    if (req.query.classId && req.query.assignmentId) {
        questions = await getQuestionsAboutLearningObjectInAssignment(
            learningObjectId,
            req.query.classId as string,
            parseInt(req.query.assignmentId as string),
            full ?? false,
            req.query.forStudent as string | undefined
        );
    } else {
        questions = await getAllQuestions(learningObjectId, full ?? false);
    }

    res.json({ questions });
}

export async function getQuestionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const question = await getQuestion(questionId);

    res.json({ question });
}

export async function createQuestionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    requireFields({ hruid });

    const loId = getLearningObjectId(hruid, version, language);

    const author = req.body.author as string;
    const content = req.body.content as string;
    const inGroup = req.body.inGroup;
    requireFields({ author, content, inGroup });

    const questionData = req.body as QuestionData;

    const question = await createQuestion(loId, questionData);

    res.json({ question });
}

export async function deleteQuestionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const question = await deleteQuestion(questionId);

    res.json({ question });
}

export async function updateQuestionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const content = req.body.content as string;
    requireFields({ content });

    const questionData = req.body as QuestionData;

    const question = await updateQuestion(questionId, questionData);

    res.json({ question });
}
