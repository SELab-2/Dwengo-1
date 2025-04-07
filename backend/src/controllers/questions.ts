import { Request, Response } from 'express';
import {
    createQuestion,
    deleteQuestion,
    getAllQuestions,
    getAnswersByQuestion,
    getQuestion,
    getQuestionsAboutLearningObjectInAssignment
} from '../services/questions.js';
import { FALLBACK_LANG, FALLBACK_SEQ_NUM } from '../config.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { Language } from '@dwengo-1/common/util/language';
import {AnswerDTO, AnswerId} from "@dwengo-1/common/interfaces/answer";

interface QuestionPathParams {
    hruid: string;
    version: string;
}

interface QuestionQueryParams {
    lang: string;
}

function getObjectId(req: Request<QuestionPathParams, any, any, QuestionQueryParams>, res: Response): LearningObjectIdentifier | null {
    const { hruid, version } = req.params;
    const lang = req.query.lang;

    if (!hruid || !version) {
        res.status(400).json({ error: 'Missing required parameters.' });
        return null;
    }

    return {
        hruid,
        language: (lang as Language) || FALLBACK_LANG,
        version: Number(version),
    };
}

interface GetQuestionIdPathParams extends QuestionPathParams {
    seq: string;
}
function getQuestionId(req: Request<GetQuestionIdPathParams, any, any, QuestionQueryParams>, res: Response): QuestionId | null {
    const seq = req.params.seq;
    const learningObjectIdentifier = getObjectId(req, res);

    if (!learningObjectIdentifier) {
        return null;
    }

    return {
        learningObjectIdentifier,
        sequenceNumber: seq ? Number(seq) : FALLBACK_SEQ_NUM,
    };
}

interface GetAllQuestionsQueryParams extends QuestionQueryParams {
    classId?: string,
    assignmentId?: number,
    forStudent?: string,
    full?: boolean
}

export async function getAllQuestionsHandler(
    req: Request<QuestionPathParams, QuestionDTO[] | QuestionId[], unknown, GetAllQuestionsQueryParams>,
    res: Response
): Promise<void> {
    const objectId = getObjectId(req, res);
    const full = req.query.full;

    if (!objectId) {
        return;
    }
    let questions: QuestionDTO[] | QuestionId[];
    if (req.query.classId && req.query.assignmentId) {
        questions = await getQuestionsAboutLearningObjectInAssignment(
            objectId,
            req.query.classId,
            req.query.assignmentId,
            full ?? false,
            req.query.forStudent
        );
    } else {
        questions = await getAllQuestions(objectId, full ?? false);
    }

    if (!questions) {
        res.status(404).json({ error: `Questions not found.` });
    } else {
        res.json({ questions: questions });
    }
}

export async function getQuestionHandler(
    req: Request<GetQuestionIdPathParams, QuestionDTO[] | QuestionId[], unknown, QuestionQueryParams>,
    res: Response
): Promise<void> {
    const questionId = getQuestionId(req, res);

    if (!questionId) {
        return;
    }

    const question = await getQuestion(questionId);

    if (!question) {
        res.status(404).json({ error: `Question not found.` });
    } else {
        res.json(question);
    }
}

interface GetQuestionAnswersQueryParams extends QuestionQueryParams {
    full: boolean
}
export async function getQuestionAnswersHandler(
    req: Request<GetQuestionIdPathParams, {answers: AnswerDTO[] | AnswerId[]}, unknown, GetQuestionAnswersQueryParams>,
    res: Response
): Promise<void> {
    const questionId = getQuestionId(req, res);
    const full = req.query.full;

    if (!questionId) {
        return;
    }

    const answers = await getAnswersByQuestion(questionId, full);

    if (!answers) {
        res.status(404).json({ error: `Questions not found` });
    } else {
        res.json({ answers: answers });
    }
}

export async function createQuestionHandler(req: Request, res: Response): Promise<void> {
    const questionDTO = req.body as QuestionDTO;

    if (!questionDTO.learningObjectIdentifier || !questionDTO.author || !questionDTO.inGroup || !questionDTO.content) {
        res.status(400).json({ error: 'Missing required fields: identifier and content' });
        return;
    }

    const question = await createQuestion(questionDTO);

    if (!question) {
        res.status(400).json({ error: 'Could not create question' });
    } else {
        res.json(question);
    }
}

export async function deleteQuestionHandler(
    req: Request<GetQuestionIdPathParams, QuestionDTO, unknown, QuestionQueryParams>,
    res: Response
): Promise<void> {
    const questionId = getQuestionId(req, res);

    if (!questionId) {
        return;
    }

    const question = await deleteQuestion(questionId);

    if (!question) {
        res.status(400).json({ error: 'Could not find nor delete question' });
    } else {
        res.json(question);
    }
}
