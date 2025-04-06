import { Request, Response } from 'express';
import { createQuestion, deleteQuestion, getAllQuestions, getAnswersByQuestion, getQuestion } from '../services/questions.js';
import {FALLBACK_LANG, FALLBACK_SEQ_NUM, FALLBACK_VERSION_NUM} from '../config.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { Language } from '@dwengo-1/common/util/language';
import {requireFields} from "./error-helper";

function getLearningObjectId(hruid: string, version: string, lang: string): LearningObjectIdentifier {
    return {
        hruid,
        language: (lang || FALLBACK_LANG) as Language,
        version: Number(version) || FALLBACK_VERSION_NUM,
    };
}

function getQuestionId(learningObjectIdentifier: LearningObjectIdentifier, seq: string): QuestionId {
    return {
        learningObjectIdentifier,
        sequenceNumber: seq ? Number(seq) : FALLBACK_SEQ_NUM,
    };
}

export async function getAllQuestionsHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const full = req.query.full === 'true';
    requireFields({ hruid })

    const learningObjectId = getLearningObjectId(hruid, version, language);

    const questions = await getAllQuestions(learningObjectId, full);

    res.json({ questions });
}

export async function getQuestionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    requireFields({ hruid })

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const question = await getQuestion(questionId);

    res.json({ question });

}

export async function getQuestionAnswersHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    const full = req.query.full === 'true';
    requireFields({ hruid })

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const answers = await getAnswersByQuestion(questionId, full);

    res.json({ answers });
}

export async function createQuestionHandler(req: Request, res: Response): Promise<void> {
    const learningObjectIdentifier = req.body.learningObjectIdentifier;
    const author = req.body.author;
    const content = req.body.content;
    requireFields({ learningObjectIdentifier, author, content });

    const questionDTO = req.body as QuestionDTO;

    const question = await createQuestion(questionDTO);

    res.json({ question });

}

export async function deleteQuestionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    requireFields({ hruid })

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const question = await deleteQuestion(questionId);

    res.json({ question });
}
