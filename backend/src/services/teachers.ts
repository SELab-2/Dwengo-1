import {
    getClassRepository,
    getLearningObjectRepository,
    getQuestionRepository,
    getStudentRepository,
    getTeacherRepository,
} from '../data/repositories.js';
import { Teacher } from '../entities/users/teacher.entity.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { getClassStudents } from './class.js';
import { StudentDTO } from '../interfaces/student.js';
import {
    mapToQuestionDTO,
    mapToQuestionId,
    QuestionDTO,
    QuestionId,
} from '../interfaces/question.js';
import { UserService } from './users.js';
import { mapToUser } from '../interfaces/user.js';

export class TeacherUserService extends UserService<Teacher> {
    constructor() {
        super(getTeacherRepository());
    }
}

export class TeacherService {
    protected teacherService = new TeacherUserService();
    protected teacherRepository = getTeacherRepository();
    protected classRepository = getClassRepository();
    protected learningObjectRepository = getLearningObjectRepository();
    protected questionRepository = getQuestionRepository();

    async fetchClassesByTeacher(username: string): Promise<ClassDTO[]> {
        const teacher = await this.teacherRepository.findByUsername(username);
        if (!teacher) {
            return [];
        }

        const classes = await this.classRepository.findByTeacher(teacher);
        return classes.map(mapToClassDTO);
    }

    async getClassesByTeacher(username: string): Promise<ClassDTO[]> {
        return await this.fetchClassesByTeacher(username);
    }

    async getClassIdsByTeacher(username: string): Promise<string[]> {
        const classes = await this.fetchClassesByTeacher(username);
        return classes.map((cls) => {
            return cls.id;
        });
    }

    async fetchStudentsByTeacher(username: string) {
        const classes = await this.getClassIdsByTeacher(username);

        return (
            await Promise.all(
                classes.map(async (id) => {
                    return getClassStudents(id);
                })
            )
        ).flat();
    }

    async getStudentsByTeacher(username: string): Promise<StudentDTO[]> {
        return await this.fetchStudentsByTeacher(username);
    }

    async getStudentIdsByTeacher(username: string): Promise<string[]> {
        const students = await this.fetchStudentsByTeacher(username);
        return students.map((student) => {
            return student.username;
        });
    }

    async fetchTeacherQuestions(username: string): Promise<QuestionDTO[]> {
        const teacherDTO =
            await this.teacherService.getUserByUsername(username);
        if (!teacherDTO) {
            throw new Error(`Teacher with username '${username}' not found.`);
        }

        const teacher = mapToUser<Teacher>(teacherDTO, new Teacher());

        // Find all learning objects that this teacher manages
        const learningObjects =
            await this.learningObjectRepository.findAllByTeacher(teacher);

        // Fetch all questions related to these learning objects
        const questions =
            await this.questionRepository.findAllByLearningObjects(
                learningObjects
            );

        return questions.map(mapToQuestionDTO);
    }

    async getQuestionsByTeacher(username: string): Promise<QuestionDTO[]> {
        return await this.fetchTeacherQuestions(username);
    }

    async getQuestionIdsByTeacher(username: string): Promise<QuestionId[]> {
        const questions = await this.fetchTeacherQuestions(username);

        return questions.map(mapToQuestionId);
    }
}
