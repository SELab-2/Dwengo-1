import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { QuestionRepository } from '../../../src/data/questions/question-repository';
import { getLearningObjectRepository, getQuestionRepository, getStudentRepository } from '../../../src/data/repositories';
import { StudentRepository } from '../../../src/data/users/student-repository';
import { LearningObjectRepository } from '../../../src/data/content/learning-object-repository';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Language } from '../../../src/entities/content/language';

describe('QuestionRepository', () => {
    let questionRepository: QuestionRepository;
    let studentRepository: StudentRepository;
    let learningObjectRepository: LearningObjectRepository;

    beforeAll(async () => {
        await setupTestApp();
        questionRepository = getQuestionRepository();
        studentRepository = getStudentRepository();
        learningObjectRepository = getLearningObjectRepository();
    });

    it('should return all questions part of the given learning object', async () => {
        const id = new LearningObjectIdentifier('id05', Language.English, 1);
        const questions = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(questions).toBeTruthy();
        expect(questions).toHaveLength(2);
    });

    it('should create new question', async () => {
        const id = new LearningObjectIdentifier('id03', Language.English, 1);
        const student = await studentRepository.findByUsername('Noordkaap');
        await questionRepository.createQuestion({
            loId: id,
            author: student!,
            content: 'question?',
        });
        const question = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(question).toBeTruthy();
        expect(question).toHaveLength(1);
    });

    it('should not find removed question', async () => {
        const id = new LearningObjectIdentifier('id04', Language.English, 1);
        await questionRepository.removeQuestionByLearningObjectAndSequenceNumber(id, 1);

        const question = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(question).toHaveLength(0);
    });
});
