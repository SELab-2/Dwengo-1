import {Request, Response} from "express";
import {
    createQuestion,
    deleteQuestion,
    getAllQuestions,
    getAnswersByQuestion,
    getQuestion
} from "../services/questions.js";
import {QuestionDTO, QuestionId} from "../interfaces/question.js";
import {FALLBACK_LANG, FALLBACK_SEQ_NUM} from "../config.js";
import {LearningObjectIdentifier} from "../entities/content/learning-object-identifier.js";
import {Language} from "../entities/content/language.js";

function getObjectId(req: Request, res: Response): LearningObjectIdentifier | null {
    const { hruid, version} = req.params
    const lang = req.query.lang

    if (!hruid || !version ) {
        res.status(400).json({ error: "Missing required parameters." });
        return null;
    }

    return {
        hruid,
        language: lang as Language || FALLBACK_LANG,
        version
    }
}

function getQuestionId(req: Request, res: Response): QuestionId | null {
    const seq = req.params.seq
    const learningObjectIdentifier = getObjectId(req,res);

    if (!learningObjectIdentifier)
        return null

    return {
        learningObjectIdentifier,
        sequenceNumber: seq ? Number(seq) : FALLBACK_SEQ_NUM
    }
}

export async function getAllQuestionsHandler(
    req: Request,
    res: Response
): Promise<void> {
    const objectId = getObjectId(req, res);
    const full = req.query.full === 'true';

    if (!objectId)
        return

    const questions = await getAllQuestions(objectId, full);

    if (!questions)
        res.status(404).json({ error: `Questions not found.` });
    else
        res.json(questions);
}

export async function getQuestionHandler(req: Request, res: Response): Promise<void> {
    const questionId = getQuestionId(req, res);

    if (!questionId)
        return

    const question = await getQuestion(questionId);

    if (!question)
        res.status(404).json({ error: `Question not found.` });
    else
        res.json(question)
}

export async function getQuestionAnswersHandler(req: Request, res: Response): Promise<void> {
    const questionId = getQuestionId(req, res);
    const full = req.query.full === 'true';

    if (!questionId)
        return

    const answers = getAnswersByQuestion(questionId, full);

    if (!answers)
        res.status(404).json({ error: `Questions not found.` });
    else
        res.json(answers)
}

export async function createQuestionHandler(req: Request, res: Response): Promise<void> {
    const questionDTO = req.body as QuestionDTO;

    if (!questionDTO.learningObjectIdentifier || !questionDTO.author || !questionDTO.content) {
        res.status(400).json({error: 'Missing required fields: identifier and content'});
        return;
    }

    const question = await createQuestion(questionDTO);

    if (!question)
        res.status(400).json({error: 'Could not add question'});
    else
        res.json(question)
}

export async function deleteQuestionHandler(req: Request, res: Response): Promise<void> {
    const questionId = getQuestionId(res, req)

    const question = await deleteQuestion(questionId);

    if (!question)
        res.status(400).json({error: 'Could not find nor delete question'});
    else
        res.json(question)
}



