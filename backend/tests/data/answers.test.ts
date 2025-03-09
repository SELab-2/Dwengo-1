import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../setup-tests';
import { AnswerRepository } from '../../src/data/questions/answer-repository';
import {
    getAnswerRepository,
    getQuestionRepository,
    getTeacherRepository,
} from '../../src/data/repositories';
import { QuestionRepository } from '../../src/data/questions/question-repository';
import { LearningObjectIdentifier } from '../../src/entities/content/learning-object-identifier';
import { Language } from '../../src/entities/content/language';
import { Question } from '../../src/entities/questions/question.entity';
import { TeacherRepository } from '../../src/data/users/teacher-repository';

describe('AnswerRepository', () => {
    let AnswerRepository: AnswerRepository;
    let QuestionRepository: QuestionRepository;
    let TeacherRepository: TeacherRepository;

    beforeAll(async () => {
        await setupTestApp();
        AnswerRepository = getAnswerRepository();
        QuestionRepository = getQuestionRepository();
        TeacherRepository = getTeacherRepository();
    });

    it('should find all answers to a question', async () => {
        const id = new LearningObjectIdentifier('id05', Language.English, '1');
        const questions =
            await QuestionRepository.findAllQuestionsAboutLearningObject(id);
        let question: Question;
        if (questions[0].sequenceNumber == 2) {
            question = questions[0];
        } else {
            question = questions[1];
        }
        const answers =
            await AnswerRepository.findAllAnswersToQuestion(question);

        expect(answers).toBeTruthy();
        expect(answers).toHaveLength(2);
    });

    // it('should create an answer to a question', async () => {
    //     const teacher = await TeacherRepository.findByUsername('FooFighters');
    //     const id = new LearningObjectIdentifier('id05', Language.English, '1');
    //     const questions =
    //         await QuestionRepository.findAllQuestionsAboutLearningObject(id);
    //     let question: Question;
    //     if (questions[0].sequenceNumber == 1) {
    //         question = questions[0];
    //     } else {
    //         question = questions[1];
    //     }
    //     await AnswerRepository.createAnswer({
    //         toQuestion: question,
    //         author: teacher!,
    //         content: 'created answer',
    //     });

    //     const answers =
    //         await AnswerRepository.findAllAnswersToQuestion(question);

    //     expect(answers).toBeTruthy();
    //     expect(answers).toHaveLength(1);
    //     expect(answers[0].content).toBe('created answer');
    // });

    it('should not find a removed answer', async () => {
        const id = new LearningObjectIdentifier('id04', Language.English, '1');
        const questions =
            await QuestionRepository.findAllQuestionsAboutLearningObject(id);

        await AnswerRepository.removeAnswerByQuestionAndSequenceNumber(
            questions[0],
            1
        );

        const emptyList = await AnswerRepository.findAllAnswersToQuestion(
            questions[0]
        );

        expect(emptyList).toHaveLength(0);
    });
});
