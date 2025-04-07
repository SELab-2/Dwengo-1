import { Request, Response } from 'express';
import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { setupTestApp } from '../setup-tests';
import { Language } from '@dwengo-1/common/util/language';
import { getAllAnswersHandler, getAnswerHandler, updateAnswerHandler } from '../../src/controllers/answers';
import { BadRequestException } from '../../src/exceptions/bad-request-exception';
import { NotFoundException } from '../../src/exceptions/not-found-exception';

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
        req = {
            params: { hruid: 'id05', version: '1', seq: '2' },
            query: { lang: Language.English, full: 'true' },
        };

        await getAllAnswersHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ answers: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.answers);
        expect(result.questions).to.have.length.greaterThan(1);
    });

    it('Get answer', async () => {
        req = {
            params: { hruid: 'id05', version: '1', seq: '2', seqAnswer: '2' },
            query: { lang: Language.English, full: 'true' },
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

    it('Update question', async () => {
        const newContent = 'updated question';
        req = {
            params: { hruid: 'id05', version: '1', seq: '2', seqAnswer: '2' },
            query: { lang: Language.English },
            body: { content: newContent },
        };

        await updateAnswerHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ answer: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.question);
        expect(result.answer.content).to.eq(newContent);
    });
});
