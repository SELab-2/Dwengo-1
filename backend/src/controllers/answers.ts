import { Request, Response } from 'express';
import { requireFields } from './error-helper.js';
import { getLearningObjectId, getQuestionId } from './questions.js';
import { createAnswer, deleteAnswer, getAnswer, getAnswersByQuestion, updateAnswer } from '../services/answers.js';
import { FALLBACK_SEQ_NUM } from '../config.js';
import { AnswerData } from '@dwengo-1/common/interfaces/answer';

export async function getAllAnswersHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    const full = req.query.full === 'true';
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const answers = await getAnswersByQuestion(questionId, full);

    res.json({ answers });
}

export async function getAnswerHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    const seqAnswer = req.params.seqAnswer;
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const sequenceNumber = Number(seqAnswer) || FALLBACK_SEQ_NUM;
    const answer = await getAnswer(questionId, sequenceNumber);

    res.json({ answer });
}

export async function createAnswerHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const author = req.body.author as string;
    const content = req.body.content as string;
    requireFields({ author, content });

    const answerData = req.body as AnswerData;

    const answer = await createAnswer(questionId, answerData);

    res.json({ answer });
}

export async function deleteAnswerHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    const seqAnswer = req.params.seqAnswer;
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const sequenceNumber = Number(seqAnswer) || FALLBACK_SEQ_NUM;
    const answer = await deleteAnswer(questionId, sequenceNumber);

    res.json({ answer });
}

export async function updateAnswerHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const version = req.params.version;
    const language = req.query.lang as string;
    const seq = req.params.seq;
    const seqAnswer = req.params.seqAnswer;
    requireFields({ hruid });

    const learningObjectId = getLearningObjectId(hruid, version, language);
    const questionId = getQuestionId(learningObjectId, seq);

    const content = req.body.content as string;
    requireFields({ content });

    const answerData = req.body as AnswerData;

    const sequenceNumber = Number(seqAnswer) || FALLBACK_SEQ_NUM;
    const answer = await updateAnswer(questionId, sequenceNumber, answerData);

    res.json({ answer });
}
