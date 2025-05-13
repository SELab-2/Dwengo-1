import { Request, Response } from 'express';
import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { setupTestApp } from '../setup-tests';
import { Language } from '@dwengo-1/common/util/language';
import { getAllAnswersHandler, getAnswerHandler, updateAnswerHandler } from '../../src/controllers/answers';
import { BadRequestException } from '../../src/exceptions/bad-request-exception';
import { NotFoundException } from '../../src/exceptions/not-found-exception';
import { getQuestion02 } from '../test_assets/questions/questions.testdata';
import { getAnswer02 } from '../test_assets/questions/answers.testdata';

describe('Questions controllers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    let jsonMock: Mock;

    beforeAll(async () => {
        await setupTestApp();
    });

    beforeEach(() => {
        jsonMock = vi.fn();
        res = {
            json: jsonMock,
        };
    });

    it('Get answers list', async () => {
        const a = getAnswer02();
        req = {
            params: {
                hruid: a.toQuestion.learningObjectHruid,
                version: a.toQuestion.learningObjectVersion.toString(),
                seq: a.toQuestion.sequenceNumber!.toString(),
            },
            query: { lang: a.toQuestion.learningObjectLanguage, full: 'true' },
        };

        await getAllAnswersHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ answers: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.answers);
        expect(result.answers).to.have.length.greaterThan(1);
    });

    it('Get answer', async () => {
        const a = getAnswer02();
        req = {
            params: {
                hruid: a.toQuestion.learningObjectHruid,
                version: a.toQuestion.learningObjectVersion.toString(),
                seq: a.toQuestion.sequenceNumber!.toString(),
                seqAnswer: a.sequenceNumber!.toString(),
            },
            query: { lang: a.toQuestion.learningObjectLanguage, full: 'true' },
        };

        await getAnswerHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ answer: expect.anything() }));

        // Const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.answer);
    });

    it('Get answer hruid does not exist', async () => {
        req = {
            params: { hruid: 'id_not_exist' },
            query: { lang: Language.English, full: 'true' },
        };

        await expect(async () => getAnswerHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Get answer no hruid given', async () => {
        req = {
            params: {},
            query: { lang: Language.English, full: 'true' },
        };

        await expect(async () => getAnswerHandler(req as Request, res as Response)).rejects.toThrow(BadRequestException);
    });

    it('Update answer', async () => {
        const a = getAnswer02();
        const q = a.toQuestion;

        const newContent = 'updated answer';
        req = {
            params: {
                hruid: q.learningObjectHruid,
                version: q.learningObjectVersion.toString(),
                seq: q.sequenceNumber!.toString(),
                seqAnswer: a.sequenceNumber!.toString(),
            },
            query: { lang: q.learningObjectLanguage },
            body: { content: newContent },
        };

        await updateAnswerHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ answer: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.question);
        expect(result.answer.content).to.eq(newContent);
    });
});
