import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Question } from '../../entities/questions/question.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { Student } from '../../entities/users/student.entity.js';
import { LearningObject } from '../../entities/content/learning-object.entity.js';
import { Assignment } from '../../entities/assignments/assignment.entity.js';
import { Loaded } from '@mikro-orm/core';
import { Group } from '../../entities/assignments/group.entity';

export class QuestionRepository extends DwengoEntityRepository<Question> {
    public async createQuestion(question: { loId: LearningObjectIdentifier; author: Student; inGroup: Group; content: string }): Promise<Question> {
        const questionEntity = this.create({
            learningObjectHruid: question.loId.hruid,
            learningObjectLanguage: question.loId.language,
            learningObjectVersion: question.loId.version,
            author: question.author,
            inGroup: question.inGroup,
            content: question.content,
            timestamp: new Date(),
        });
        questionEntity.learningObjectHruid = question.loId.hruid;
        questionEntity.learningObjectLanguage = question.loId.language;
        questionEntity.learningObjectVersion = question.loId.version;
        questionEntity.author = question.author;
        questionEntity.inGroup = question.inGroup;
        questionEntity.content = question.content;
        return await this.insert(questionEntity);
    }
    public async findAllQuestionsAboutLearningObject(loId: LearningObjectIdentifier): Promise<Question[]> {
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
    public async removeQuestionByLearningObjectAndSequenceNumber(loId: LearningObjectIdentifier, sequenceNumber: number): Promise<void> {
        return this.deleteWhere({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            sequenceNumber: sequenceNumber,
        });
    }

    public async findAllByLearningObjects(learningObjects: LearningObject[]): Promise<Question[]> {
        const objectIdentifiers = learningObjects.map((lo) => ({
            learningObjectHruid: lo.hruid,
            learningObjectLanguage: lo.language,
            learningObjectVersion: lo.version,
        }));

        return this.findAll({
            where: { $or: objectIdentifiers },
            orderBy: { timestamp: 'ASC' },
        });
    }

    public async findAllByAssignment(assignment: Assignment): Promise<Question[]> {
        return this.find({
            inGroup: assignment.groups.getItems(),
            learningObjectHruid: assignment.learningPathHruid,
            learningObjectLanguage: assignment.learningPathLanguage,
        });
    }

    public async findAllByAuthor(author: Student): Promise<Question[]> {
        return this.findAll({
            where: { author },
            orderBy: { timestamp: 'DESC' }, // New to old
        });
    }

    public async findAllByGroup(inGroup: Group): Promise<Question[]> {
        return this.findAll({
            where: { inGroup },
            orderBy: { timestamp: 'DESC' },
        });
    }

    /**
     * Looks up all questions for the given learning object which were asked as part of the given assignment.
     * When forStudentUsername is set, only the questions within the given user's group are shown.
     */
    public async findAllQuestionsAboutLearningObjectInAssignment(
        loId: LearningObjectIdentifier,
        assignment: Assignment,
        forStudentUsername?: string
    ): Promise<Question[]> {
        const inGroup = forStudentUsername
            ? {
                  assignment,
                  members: {
                      $some: {
                          username: forStudentUsername,
                      },
                  },
              }
            : {
                  assignment,
              };

        return this.findAll({
            where: {
                learningObjectHruid: loId.hruid,
                learningObjectLanguage: loId.language,
                learningObjectVersion: loId.version,
                inGroup,
            },
        });
    }

    public async findByLearningObjectAndSequenceNumber(loId: LearningObjectIdentifier, sequenceNumber: number): Promise<Loaded<Question> | null> {
        return this.findOne({
            learningObjectHruid: loId.hruid,
            learningObjectLanguage: loId.language,
            learningObjectVersion: loId.version,
            sequenceNumber,
        });
    }

    public async updateContent(question: Question, newContent: string): Promise<Question> {
        question.content = newContent;
        await this.save(question);
        return question;
    }
}
