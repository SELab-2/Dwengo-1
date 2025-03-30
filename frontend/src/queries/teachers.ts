import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {TeacherController} from "@/controllers/teachers.ts";

const teacherController = new TeacherController();

/** 🔑 Query keys */
const TEACHERS_QUERY_KEY = (full: boolean) => ["teachers", full];
const TEACHER_QUERY_KEY = (username: string) => ["teacher", username];
const TEACHER_CLASSES_QUERY_KEY = (username: string, full: boolean) => ["teacher-classes", username, full];
const TEACHER_STUDENTS_QUERY_KEY = (username: string, full: boolean) => ["teacher-students", username, full];
const TEACHER_QUESTIONS_QUERY_KEY = (username: string, full: boolean) => ["teacher-questions", username, full];
const JOIN_REQUESTS_QUERY_KEY = (username: string, classId: string) => ["join-requests", username, classId];

export function useTeachersQuery(full: MaybeRefOrGetter<boolean> = false) {
    return useQuery({
        queryKey: computed(() => TEACHERS_QUERY_KEY(toValue(full))),
        queryFn: () => teacherController.getAll(toValue(full)),
    });
}

export function useTeacherQuery(username: MaybeRefOrGetter<string | undefined>) {
    return useQuery({
        queryKey: computed(() => TEACHER_QUERY_KEY(toValue(username)!)),
        queryFn: () => teacherController.getByUsername(toValue(username)!),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherClassesQuery(username: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = false) {
    return useQuery({
        queryKey: computed(() => TEACHER_CLASSES_QUERY_KEY(toValue(username)!, toValue(full))),
        queryFn: () => teacherController.getClasses(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherStudentsQuery(username: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = false) {
    return useQuery({
        queryKey: computed(() => TEACHER_STUDENTS_QUERY_KEY(toValue(username)!, toValue(full))),
        queryFn: () => teacherController.getStudents(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherQuestionsQuery(username: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = false) {
    return useQuery({
        queryKey: computed(() => TEACHER_QUESTIONS_QUERY_KEY(toValue(username)!, toValue(full))),
        queryFn: () => teacherController.getQuestions(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherJoinRequestsQuery(username: MaybeRefOrGetter<string | undefined>, classId: MaybeRefOrGetter<string | undefined>) {
    return useQuery({
        queryKey: computed(() => JOIN_REQUESTS_QUERY_KEY(toValue(username)!, toValue(classId)!)),
        queryFn: () => teacherController.getStudentJoinRequests(toValue(username)!, toValue(classId)!),
        enabled: () => Boolean(toValue(username)) && Boolean(toValue(classId)),
    });
}

export function useCreateTeacherMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => teacherController.createTeacher(data),
        onSuccess: () => {
            await queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
        onError: (err) => {
            alert("Create teacher failed:", err);
        },
    });
}

export function useDeleteTeacherMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (username: string) => teacherController.deleteTeacher(username),
        onSuccess: () => {
            await queryClient.invalidateQueries({ queryKey: ['teachers'] });
        },
        onError: (err) => {
            alert("Delete teacher failed:", err);
        },
    });
}

export function useUpdateJoinRequestMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ teacherUsername, classId, studentUsername, accepted }: {
            teacherUsername: string;
            classId: string;
            studentUsername: string;
            accepted: boolean;
        }) => teacherController.updateStudentJoinRequest(teacherUsername, classId, studentUsername, accepted),
        onSuccess: (_, { teacherUsername, classId }) => {
            queryClient.invalidateQueries({ queryKey: JOIN_REQUESTS_QUERY_KEY(teacherUsername, classId) });
        },
        onError: (err) => {
            alert("Failed to update join request:", err);
        },
    });
}
