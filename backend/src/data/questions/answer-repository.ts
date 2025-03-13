import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Answer } from '../../entities/questions/answer.entity.js';
import { Question } from '../../entities/questions/question.entity.js';
import { Teacher } from '../../entities/users/teacher.entity.js';

export class AnswerRepository extends DwengoEntityRepository<Answer> {
    public createAnswer(answer: {
        toQuestion: Question;
        author: Teacher;
        content: string;
    }): Promise<Answer> {
        const answerEntity = this.create(
            {
                toQuestion: answer.toQuestion,
                author: answer.author,
                content: answer.content,
                timestamp: new Date()
            }
        );
        return this.insert(answerEntity);
    }
    public findAllAnswersToQuestion(question: Question): Promise<Answer[]> {
        return this.findAll({
            where: { toQuestion: question },
            orderBy: { sequenceNumber: 'ASC' },
        });
    }
    public removeAnswerByQuestionAndSequenceNumber(question: Question, sequenceNumber: number): Promise<void> {
        return this.deleteWhere({
            toQuestion: question,
            sequenceNumber: sequenceNumber,
        });
    }
}
