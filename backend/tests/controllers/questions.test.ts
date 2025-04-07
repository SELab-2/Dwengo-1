import {beforeAll, beforeEach, describe, expect, it, Mock, vi} from "vitest";
import {Request, Response} from "express";
import {setupTestApp} from "../setup-tests";
import {
    getAllQuestionsHandler,
    getQuestionHandler, updateQuestionHandler
} from "../../src/controllers/questions";
import {Language} from "@dwengo-1/common/util/language";
import {NotFoundException} from "../../src/exceptions/not-found-exception";
import {BadRequestException} from "../../src/exceptions/bad-request-exception";


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
        req = {
            params: { hruid: 'id05', version: '1' },
            query: { lang: Language.English, full: 'true' },
        };

        await getAllQuestionsHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ questions: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // console.log(result.questions);
        expect(result.questions).to.have.length.greaterThan(1);
    });

    it('Get question', async () => {
        req = {
            params: { hruid: 'id05', version: '1', seq: '1'},
            query: { lang: Language.English, full: 'true' },
        };

        await getQuestionHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ question: expect.anything() }));

        // const result = jsonMock.mock.lastCall?.[0];
        // console.log(result.question);
    })

    it('Get question with fallback sequence number and version', async () => {
        req = {
            params: { hruid: 'id05'},
            query: { lang: Language.English, full: 'true' },
        };

        await getQuestionHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ question: expect.anything() }));

        // const result = jsonMock.mock.lastCall?.[0];
        // console.log(result.question);
    })

    it('Get question hruid does not exist', async () => {
        req = {
            params: { hruid: 'id_not_exist'},
            query: { lang: Language.English, full: 'true' },
        };

        await expect( async () => getQuestionHandler(req as Request, res as Response))
            .rejects.toThrow(NotFoundException);
    })

    it('Get question no hruid given', async () => {
        req = {
            params: {},
            query: { lang: Language.English, full: 'true' },
        };

        await expect( async () => getQuestionHandler(req as Request, res as Response))
            .rejects.toThrow(BadRequestException);
    })

    /*
    it('Create and delete question', async() => {
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

    it('Update question', async() => {
        const newContent = "updated question";
        req = {
            params: { hruid: 'id05', version: '1', seq: '1'},
            query: { lang: Language.English },
            body: { content: newContent }
        };

        await updateQuestionHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ question: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // console.log(result.question);
        expect(result.question.content).to.eq(newContent);
    });
});
