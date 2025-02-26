import { DwengoEntityRepository } from '../dwengo-entity-repository';
import { Question } from '../../entities/questions/question.entity';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier';
import { Student } from '../../entities/users/student.entity';

export class QuestionRepository extends DwengoEntityRepository<Question> {
    public createQuestion(question: {
        loId: LearningObjectIdentifier;
        author: Student;
        content: string;
    }): Promise<Question> {
        let questionEntity = new Question();
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
