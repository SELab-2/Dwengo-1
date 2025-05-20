import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { AnswerRepository } from '../../../src/data/questions/answer-repository';
import { getAnswerRepository } from '../../../src/data/repositories';
import { getQuestion01, getQuestion02 } from '../../test_assets/questions/questions.testdata';
import { getAnswer01, getAnswer02, getAnswer03 } from '../../test_assets/questions/answers.testdata';
import { getFooFighters } from '../../test_assets/users/teachers.testdata';

describe('AnswerRepository', () => {
    let answerRepository: AnswerRepository;

    beforeAll(async () => {
        await setupTestApp();
        answerRepository = getAnswerRepository();
    });

    it('should find all answers to a question', async () => {
        const question = getQuestion02();
        const a1 = getAnswer01();
        const a2 = getAnswer02();

        const answers = await answerRepository.findAllAnswersToQuestion(question);

        expect(answers).toBeTruthy();
        expect(answers).toHaveLength(2);
        expect(answers[0].content).toBeOneOf([a1.content, a2.content]);
        expect(answers[1].content).toBeOneOf([a1.content, a2.content]);
    });

    it('should create an answer to a question', async () => {
        const teacher = getFooFighters();
        const question = getQuestion01();

        await answerRepository.createAnswer({
            toQuestion: question,
            author: teacher,
            content: 'created answer',
        });

        const answers = await answerRepository.findAllAnswersToQuestion(question);

        expect(answers).toBeTruthy();
        expect(answers).toHaveLength(1);
        expect(answers[0].content).toBe('created answer');
    });

    it('should not find a removed answer', async () => {
        const deleted = getAnswer03();

        await answerRepository.removeAnswerByQuestionAndSequenceNumber(deleted.toQuestion, deleted.sequenceNumber!);

        const emptyList = await answerRepository.findAllAnswersToQuestion(deleted.toQuestion);

        expect(emptyList).toHaveLength(0);
    });
});
