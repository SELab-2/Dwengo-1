import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { QuestionRepository } from '../../../src/data/questions/question-repository';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getQuestionRepository,
    getStudentRepository,
} from '../../../src/data/repositories';
import { StudentRepository } from '../../../src/data/users/student-repository';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Language } from '@dwengo-1/common/util/language';
import { Question } from '../../../src/entities/questions/question.entity';
import { Class } from '../../../src/entities/classes/class.entity';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';

describe('QuestionRepository', () => {
    let questionRepository: QuestionRepository;
    let studentRepository: StudentRepository;

    beforeAll(async () => {
        await setupTestApp();
        questionRepository = getQuestionRepository();
        studentRepository = getStudentRepository();
    });

    it('should return all questions part of the given learning object', async () => {
        const id = new LearningObjectIdentifier('id05', Language.English, 1);
        const questions = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(questions).toBeTruthy();
        expect(questions).toHaveLength(4);
    });

    it('should create new question', async () => {
        const id = new LearningObjectIdentifier('id03', Language.English, 1);
        const student = await studentRepository.findByUsername('Noordkaap');

        const clazz = await getClassRepository().findById('8764b861-90a6-42e5-9732-c0d9eb2f55f9');
        const assignment = await getAssignmentRepository().findByClassAndId(clazz!, 1);
        const group = await getGroupRepository().findByAssignmentAndGroupNumber(assignment!, 1);
        await questionRepository.createQuestion({
            loId: id,
            inGroup: group!,
            author: student!,
            content: 'question?',
        });
        const question = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(question).toBeTruthy();
        expect(question).toHaveLength(1);
    });

    let clazz: Class | null;
    let assignment: Assignment | null;
    let loId: LearningObjectIdentifier;
    it('should find all questions for a certain learning object and assignment', async () => {
        clazz = await getClassRepository().findById('8764b861-90a6-42e5-9732-c0d9eb2f55f9');
        assignment = await getAssignmentRepository().findByClassAndId(clazz!, 1);
        loId = {
            hruid: 'id05',
            language: Language.English,
            version: 1,
        };
        const result = await questionRepository.findAllQuestionsAboutLearningObjectInAssignment(loId, assignment!);
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
        const result = await questionRepository.findAllQuestionsAboutLearningObjectInAssignment(loId, assignment!, 'Tool');
        // (student Tool is in group #2)

        expect(result).toHaveLength(1);

        // Question01 and question02 are in group #1 => not displayed.

        // Question05: About learning object 'id05', in group #2 for Assignment #1 in class 'id01'
        expect(result[0].learningObjectHruid).toEqual(loId.hruid);
        expect(result[0].sequenceNumber).toEqual(3);

        // Question06: About learning object 'id05', but for Assignment #2 in class 'id01' => not expected.
    });

    it('should not find removed question', async () => {
        const id = new LearningObjectIdentifier('id04', Language.English, 1);
        await questionRepository.removeQuestionByLearningObjectAndSequenceNumber(id, 1);

        const question = await questionRepository.findAllQuestionsAboutLearningObject(id);

        expect(question).toHaveLength(0);
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
