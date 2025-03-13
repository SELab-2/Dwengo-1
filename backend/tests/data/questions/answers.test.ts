import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { AnswerRepository } from '../../../src/data/questions/answer-repository';
import {
    getAnswerRepository,
    getQuestionRepository,
    getTeacherRepository,
} from '../../../src/data/repositories';
import { QuestionRepository } from '../../../src/data/questions/question-repository';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Language } from '../../../src/entities/content/language';
import { TeacherRepository } from '../../../src/data/users/teacher-repository';

describe('AnswerRepository', () => {
    let answerRepository: AnswerRepository;
    let questionRepository: QuestionRepository;
    let teacherRepository: TeacherRepository;

    beforeAll(async () => {
        await setupTestApp();
        answerRepository = getAnswerRepository();
        questionRepository = getQuestionRepository();
        teacherRepository = getTeacherRepository();
    });

    it('should find all answers to a question', async () => {
        const id = new LearningObjectIdentifier('id05', Language.English, '1');
        const questions =
            await questionRepository.findAllQuestionsAboutLearningObject(id);

        const question = questions.filter((it) => it.sequenceNumber == 2)[0];

        const answers =
            await answerRepository.findAllAnswersToQuestion(question);

        expect(answers).toBeTruthy();
        expect(answers).toHaveLength(2);
        expect(answers[0].content).toBeOneOf(['answer', 'answer2']);
        expect(answers[1].content).toBeOneOf(['answer', 'answer2']);
    });

    it('should create an answer to a question', async () => {
        const teacher = await teacherRepository.findByUsername('FooFighters');
        const id = new LearningObjectIdentifier('id05', Language.English, '1');
        const questions =
            await questionRepository.findAllQuestionsAboutLearningObject(id);

        const question = questions[0];

        await answerRepository.createAnswer({
            toQuestion: question,
            author: teacher!,
            content: 'created answer',
        });

        const answers =
            await answerRepository.findAllAnswersToQuestion(question);

        expect(answers).toBeTruthy();
        expect(answers).toHaveLength(1);
        expect(answers[0].content).toBe('created answer');
    });

    it('should not find a removed answer', async () => {
        const id = new LearningObjectIdentifier('id04', Language.English, '1');
        const questions =
            await questionRepository.findAllQuestionsAboutLearningObject(id);

        await answerRepository.removeAnswerByQuestionAndSequenceNumber(
            questions[0],
            1
        );

        const emptyList = await answerRepository.findAllAnswersToQuestion(
            questions[0]
        );

        expect(emptyList).toHaveLength(0);
    });
});
