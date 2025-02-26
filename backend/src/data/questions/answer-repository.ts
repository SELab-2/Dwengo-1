import { DwengoEntityRepository } from '../dwengo-entity-repository';
import { Answer } from '../../entities/questions/answer.entity';
import { Question } from '../../entities/questions/question.entity';
import { Teacher } from '../../entities/users/teacher.entity';

export class AnswerRepository extends DwengoEntityRepository<Answer> {
    public createAnswer(answer: {
        toQuestion: Question;
        author: Teacher;
        content: string;
    }): Promise<Answer> {
        let answerEntity = new Answer();
        answerEntity.toQuestion = answer.toQuestion;
        answerEntity.author = answer.author;
        answerEntity.content = answer.content;
        return this.insert(answerEntity);
    }
    public findAllAnswersToQuestion(question: Question): Promise<Answer[]> {
        return this.findAll({
            where: { toQuestion: question },
            orderBy: { sequenceNumber: 'ASC' },
        });
    }
    public removeAnswerByQuestionAndSequenceNumber(
        question: Question,
        sequenceNumber: number
    ): Promise<void> {
        return this.deleteWhere({
            toQuestion: question,
            sequenceNumber: sequenceNumber,
        });
    }
}
