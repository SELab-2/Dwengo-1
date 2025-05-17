import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { QuestionRepository } from '../../../src/data/questions/question-repository';
import { getQuestionRepository } from '../../../src/data/repositories';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Question } from '../../../src/entities/questions/question.entity';
import { testLearningObject03, testLearningObject05 } from '../../test_assets/content/learning-objects.testdata';
import { getQuestion01, getQuestion02, getQuestion03, getQuestion05, getQuestion06 } from '../../test_assets/questions/questions.testdata';
import { getNoordkaap, getTool } from '../../test_assets/users/students.testdata';
import { getAssignment01 } from '../../test_assets/assignments/assignments.testdata';
import { getTestGroup01 } from '../../test_assets/assignments/groups.testdata';

describe('QuestionRepository', () => {
    let questionRepository: QuestionRepository;

    beforeAll(async () => {
        await setupTestApp();
        questionRepository = getQuestionRepository();
    });

    it('should return all questions part of the given learning object', async () => {
        const q1 = getQuestion01();
        const q2 = getQuestion02();
        const q3 = getQuestion05();
        const q4 = getQuestion06();
        const loid = {
            hruid: q1.learningObjectHruid,
            language: q1.learningObjectLanguage,
            version: q1.learningObjectVersion,
        } as LearningObjectIdentifier;
        const questions = await questionRepository.findAllQuestionsAboutLearningObject(loid);

        expect(questions).toBeTruthy();
        expect(questions).toHaveLength(4);
        expect(questions[0].sequenceNumber!).toBeOneOf([q1.sequenceNumber, q2.sequenceNumber, q3.sequenceNumber, q4.sequenceNumber]);
        expect(questions[1].sequenceNumber!).toBeOneOf([q1.sequenceNumber, q2.sequenceNumber, q3.sequenceNumber, q4.sequenceNumber]);
        expect(questions[2].sequenceNumber!).toBeOneOf([q1.sequenceNumber, q2.sequenceNumber, q3.sequenceNumber, q4.sequenceNumber]);
        expect(questions[3].sequenceNumber!).toBeOneOf([q1.sequenceNumber, q2.sequenceNumber, q3.sequenceNumber, q4.sequenceNumber]);
    });

    it('should create new question', async () => {
        const id = {
            hruid: testLearningObject03.hruid,
            language: testLearningObject03.language,
            version: testLearningObject03.version,
        } as LearningObjectIdentifier;
        const student = getNoordkaap();
        const group = getTestGroup01();
        await questionRepository.createQuestion({
            loId: id,
            inGroup: group,
            author: student,
            content: 'question?',
        });
        const question = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(question).toBeTruthy();
        expect(question).toHaveLength(1);
        expect(question[0].content).toBe('question?');
    });

    it('should find all questions for a certain learning object and assignment', async () => {
        const assignment = getAssignment01();
        const loId = {
            hruid: testLearningObject05.hruid,
            language: testLearningObject05.language,
            version: testLearningObject05.version,
        };
        const result = await questionRepository.findAllQuestionsAboutLearningObjectInAssignment(loId, assignment);
        sortQuestions(result);

        expect(result).toHaveLength(3);

        // Question01: About learning object 'id05', in group #1 for Assignment #1 in class 'id01'
        expect(result[0].learningObjectHruid).toEqual(loId.hruid);
        expect(result[0].sequenceNumber).toEqual(1);

        // Question02: About learning object 'id05', in group #1 for Assignment #1 in class 'id01'
        expect(result[1].learningObjectHruid).toEqual(loId.hruid);
        expect(result[1].sequenceNumber).toEqual(2);

        // Question05: About learning object 'id05', in group #2 for Assignment #1 in class 'id01'
        expect(result[2].learningObjectHruid).toEqual(loId.hruid);
        expect(result[2].sequenceNumber).toEqual(3);

        // Question06: About learning object 'id05', but for Assignment #2 in class 'id01' => not expected.
    });

    it("should find only the questions for a certain learning object and assignment asked by the user's group", async () => {
        const loId = {
            hruid: testLearningObject05.hruid,
            language: testLearningObject05.language,
            version: testLearningObject05.version,
        };
        const assignment = getAssignment01();

        const result = await questionRepository.findAllQuestionsAboutLearningObjectInAssignment(loId, assignment, getTool().username);
        // (student Tool is in group #2)

        expect(result).toHaveLength(1);

        // Question01 and question02 are in group #1 => not displayed.

        // Question05: About learning object 'id05', in group #2 for Assignment #1 in class 'id01'
        expect(result[0].learningObjectHruid).toEqual(loId.hruid);
        expect(result[0].sequenceNumber).toEqual(3);

        // Question06: About learning object 'id05', but for Assignment #2 in class 'id01' => not expected.
    });

    it('should not find removed question', async () => {
        const usedQuestion = getQuestion03();
        const id = {
            hruid: usedQuestion.learningObjectHruid,
            language: usedQuestion.learningObjectLanguage,
            version: usedQuestion.learningObjectVersion,
        } as LearningObjectIdentifier;
        await questionRepository.removeQuestionByLearningObjectAndSequenceNumber(id, usedQuestion.sequenceNumber!);

        const questions = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(questions).toHaveLength(0);
    });
});

function sortQuestions(questions: Question[]): void {
    questions.sort((a, b) => {
        if (a.learningObjectHruid < b.learningObjectHruid) {
            return -1;
        } else if (a.learningObjectHruid > b.learningObjectHruid) {
            return 1;
        }
        return a.sequenceNumber! - b.sequenceNumber!;
    });
}
