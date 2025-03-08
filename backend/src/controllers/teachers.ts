import { Request, Response } from 'express';
import {
    createTeacher,
    deleteTeacher,
    fetchTeacherByUsername,
    getClassesByTeacher,
    getClassIdsByTeacher,
    getAllTeachers,
    getAllTeachersIds, getStudentsByTeacher, getStudentIdsByTeacher
} from '../services/teachers.js';
import {TeacherDTO} from "../interfaces/teacher";
import {ClassDTO} from "../interfaces/class";
import {StudentDTO} from "../interfaces/student";

export async function getTeacherHandler(req: Request, res: Response): Promise<void> {
    try {
        const full = req.query.full === 'true';
        const username = req.query.username as string;

        if (username){
            const teacher = await fetchTeacherByUsername(username);
            if (!teacher){
                res.status(404).json({ error: `Teacher with username '${username}' not found.` });
                return;
            }
            res.json(teacher);
            return;
        }

        let teachers: TeacherDTO[] | string[];

        if (full) teachers = await getAllTeachers();
        else teachers = await getAllTeachersIds();

        res.json(teachers);
    } catch (error) {
        console.error("❌ Error fetching teachers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function createTeacherHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const teacherData = req.body as TeacherDTO;

        if (!teacherData.username || !teacherData.firstName || !teacherData.lastName) {
            res.status(400).json({ error: 'Missing required fields: username, firstName, lastName' });
            return;
        }

        const newTeacher = await createTeacher(teacherData);
        res.status(201).json(newTeacher);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteTeacherHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const username = req.params.username as string;

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const deletedTeacher = await deleteTeacher(username);

        if (!deletedTeacher) {
            res.status(400).json({ error: `Did not find teacher with username ${username}` });
            return;
        }

        res.status(201).json(deletedTeacher);
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTeacherClassHandler(req: Request, res: Response): Promise<void> {
    try {
        const username = req.params.username as string;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        let classes: ClassDTO[] | string[];

        if (full) classes = await getClassesByTeacher(username);
        else classes = await getClassIdsByTeacher(username);

        res.status(201).json(classes);
    } catch (error) {
        console.error('Error fetching classes by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTeacherStudentHandler(req: Request, res: Response): Promise<void> {
    try {
        const username = req.params.username as string;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        let students: StudentDTO[] | string[];

        if (full) students = await getStudentsByTeacher(username);
        else students = await getStudentIdsByTeacher(username);

        res.status(201).json(students);
    } catch (error) {
        console.error('Error fetching students by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
