import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Question } from '../../entities/questions/question.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { Student } from '../../entities/users/student.entity.js';

export class QuestionRepository extends DwengoEntityRepository<Question> {
    public createQuestion(question: {
        loId: LearningObjectIdentifier;
        author: Student;
        content: string;
    }): Promise<Question> {
        const questionEntity = this.create({
            learningObjectHruid: question.loId.hruid,
            learningObjectLanguage: question.loId.language,
            learningObjectVersion: question.loId.version,
            author: question.author,
            content: question.content,
            timestamp: new Date()
        });
        questionEntity.learningObjectHruid = question.loId.hruid;
        questionEntity.learningObjectLanguage = question.loId.language;
        questionEntity.learningObjectVersion = question.loId.version;
        questionEntity.author = question.author;
        questionEntity.content = question.content;
        return this.insert(questionEntity);
    }
    public findAllQuestionsAboutLearningObject(
        loId: LearningObjectIdentifier
    ): Promise<Question[]> {
        return this.findAll({
            where: {
                learningObjectHruid: loId.hruid,
                learningObjectLanguage: loId.language,
                learningObjectVersion: loId.version,
            },
            orderBy: {
                sequenceNumber: 'ASC',
            },
        });
    }
    public removeQuestionByLearningObjectAndSequenceNumber(
        loId: LearningObjectIdentifier,
        sequenceNumber: number
    ): Promise<void> {
        return this.deleteWhere({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            sequenceNumber: sequenceNumber,
        });
    }
}
