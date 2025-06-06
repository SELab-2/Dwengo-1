import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Request, Response } from 'express';
import { setupTestApp } from '../setup-tests';
import { getAllQuestionsHandler, getQuestionHandler, updateQuestionHandler } from '../../src/controllers/questions';
import { Language } from '@dwengo-1/common/util/language';
import { NotFoundException } from '../../src/exceptions/not-found-exception';
import { BadRequestException } from '../../src/exceptions/bad-request-exception';
import { getQuestion01 } from '../test_assets/questions/questions.testdata';

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

    it('Get question list', async () => {
        const q = getQuestion01();
        req = {
            params: { hruid: q.learningObjectHruid, version: q.learningObjectVersion.toString() },
            query: { lang: q.learningObjectLanguage, full: 'true' },
        };

        await getAllQuestionsHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ questions: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.questions);
        expect(result.questions).to.have.length.greaterThan(1);
    });

    it('Get question', async () => {
        const q = getQuestion01();
        req = {
            params: { hruid: q.learningObjectHruid, version: q.learningObjectVersion.toString(), seq: q.sequenceNumber!.toString() },
            query: { lang: q.learningObjectLanguage, full: 'true' },
        };

        await getQuestionHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ question: expect.anything() }));

        // Const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.question);
    });

    it('Get question with fallback sequence number and version', async () => {
        const q = getQuestion01();
        req = {
            params: { hruid: q.learningObjectHruid },
            query: { lang: Language.English, full: 'true' },
        };

        await getQuestionHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ question: expect.anything() }));

        // Const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.question);
    });

    it('Get question hruid does not exist', async () => {
        req = {
            params: { hruid: 'id_not_exist' },
            query: { lang: Language.English, full: 'true' },
        };

        await expect(async () => getQuestionHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Get question no hruid given', async () => {
        req = {
            params: {},
            query: { lang: Language.English, full: 'true' },
        };

        await expect(async () => getQuestionHandler(req as Request, res as Response)).rejects.toThrow(BadRequestException);
    });

    /*
    It('Create and delete question', async() => {
        req = {
            params: { hruid: 'id05', version: '1', seq: '2'},
            query: { lang: Language.English },
        };

        await deleteQuestionHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ question: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        console.log(result.question);
    });

     */

    it('Update question', async () => {
        const q = getQuestion01();
        const newContent = 'updated question';
        req = {
            params: { hruid: q.learningObjectHruid, version: q.learningObjectVersion.toString(), seq: q.sequenceNumber!.toString() },
            query: { lang: q.learningObjectLanguage },
            body: { content: newContent },
        };

        await updateQuestionHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ question: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.question);
        expect(result.question.content).to.eq(newContent);
    });
});
