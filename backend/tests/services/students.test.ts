import {describe, it, expect, vi, beforeEach, beforeAll} from 'vitest';
import {Student} from "../../src/entities/users/student.entity";
import {StudentDTO} from "../../src/interfaces/student";
import {setupTestApp} from "../setup-tests";
import {createStudent, deleteStudent, getAllStudents, getStudent} from "../../src/services/students";

const mockStudentRepo = {
    findAll: vi.fn(),
    findByUsername: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    deleteByUsername: vi.fn(),
};

describe('StudentService', () => {

    beforeAll(async () => {
        await setupTestApp();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mock('../../src/data/repositories', () => ({
            getStudentRepository: () => mockStudentRepo,
        }));
    });

    it('Student list full', async () => {
        mockStudentRepo.findAll.mockResolvedValue([
            new Student('DireStraits', 'Mark', 'Knopfler'),
        ]);

        const result = await getAllStudents(true);

        expect(mockStudentRepo.findAll).toHaveBeenCalled();
        expect(result[0]).toHaveProperty('username', 'DireStraits');
    });

    it('Student list ids', async () => {
        mockStudentRepo.findAll.mockResolvedValue([
            new Student('Tool', 'Maynard', 'Keenan'),
        ]);

        const result = await getAllStudents(false);

        expect(mockStudentRepo.findAll).toHaveBeenCalled();
        expect(result).toContain('Tool');
        expect(typeof result[0]).toBe('string');
    });

    it('Student not found', async () => {
        mockStudentRepo.findByUsername.mockResolvedValue(null);

        const result = await getStudent('doesnotexist');
        expect(result).toBeNull();
    });

    it('Create + get student', async () => {
        const dto: StudentDTO = {
            username: 'SmashingPumpkins',
            firstName: 'Billy',
            lastName: 'Corgan',
        };

        const studentEntity = new Student(dto.username, dto.firstName, dto.lastName);

        mockStudentRepo.create.mockReturnValue(studentEntity);
        mockStudentRepo.save.mockResolvedValue(undefined);
        mockStudentRepo.findByUsername.mockResolvedValue(studentEntity);

        const created = await createStudent(dto);
        const found = await getStudent(dto.username);

        expect(created).not.toBeNull();
        expect(found).not.toBeNull();
        expect(found?.username).toBe(dto.username);
    });

    it('Delete non existing student', async () => {
        mockStudentRepo.findByUsername.mockResolvedValue(null);

        const result = await deleteStudent('ghost');
        expect(result).toBeNull();
    });

    it('Delete student', async () => {
        const student = new Student('TheDoors', 'Jim', 'Morisson');
        mockStudentRepo.findByUsername.mockResolvedValue(student);
        mockStudentRepo.deleteByUsername.mockResolvedValue(undefined);

        const result = await deleteStudent('TheDoors');

        expect(mockStudentRepo.deleteByUsername).toHaveBeenCalledWith('TheDoors');
        expect(result?.username).toBe('TheDoors');
    });
});
