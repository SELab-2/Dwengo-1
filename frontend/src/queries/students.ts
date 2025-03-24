import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getStudentController } from "@/controllers/controllers.ts";

const studentController = getStudentController();

/** 🔑 Query keys */
const STUDENTS_QUERY_KEY = (full: boolean) => ['students', full];
const STUDENT_QUERY_KEY = (username: string) => ['student', username];
const STUDENT_CLASSES_QUERY_KEY = (username: string, full: boolean) => ['student-classes', username, full];
const STUDENT_ASSIGNMENTS_QUERY_KEY = (username: string, full: boolean) => ['student-assignments', username, full];
const STUDENT_GROUPS_QUERY_KEY = (username: string, full: boolean) => ['student-groups', username, full];
const STUDENT_SUBMISSIONS_QUERY_KEY = (username: string) => ['student-submissions', username];
const STUDENT_QUESTIONS_QUERY_KEY = (username: string, full: boolean) => ['student-questions', username, full];

export function useStudentsQuery(full: MaybeRefOrGetter<boolean> = true) {
    return useQuery({
        queryKey: computed(() => STUDENTS_QUERY_KEY(toValue(full))),
        queryFn: () => studentController.getAll(toValue(full)),
    });
}

export function useStudentQuery(username: MaybeRefOrGetter<string | undefined>) {
    return useQuery({
        queryKey: computed(() => STUDENT_QUERY_KEY(toValue(username)!)),
        queryFn: () => studentController.getByUsername(toValue(username)!),
        enabled: () => !!toValue(username),
    });
}

export function useStudentClassesQuery(username: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = true) {
    return useQuery({
        queryKey: computed(() => STUDENT_CLASSES_QUERY_KEY(toValue(username)!, toValue(full))),
        queryFn: () => studentController.getClasses(toValue(username)!, toValue(full)),
        enabled: () => !!toValue(username),
    });
}

export function useStudentAssignmentsQuery(username: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = true) {
    return useQuery({
        queryKey: computed(() => STUDENT_ASSIGNMENTS_QUERY_KEY(toValue(username)!, toValue(full))),
        queryFn: () => studentController.getAssignments(toValue(username)!, toValue(full)),
        enabled: () => !!toValue(username),
    });
}

export function useStudentGroupsQuery(username: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = true) {
    return useQuery({
        queryKey: computed(() => STUDENT_GROUPS_QUERY_KEY(toValue(username)!, toValue(full))),
        queryFn: () => studentController.getGroups(toValue(username)!, toValue(full)),
        enabled: () => !!toValue(username),
    });
}

export function useStudentSubmissionsQuery(username: MaybeRefOrGetter<string | undefined>) {
    return useQuery({
        queryKey: computed(() => STUDENT_SUBMISSIONS_QUERY_KEY(toValue(username)!)),
        queryFn: () => studentController.getSubmissions(toValue(username)!),
        enabled: () => !!toValue(username),
    });
}

export function useStudentQuestionsQuery(username: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = true) {
    return useQuery({
        queryKey: computed(() => STUDENT_QUESTIONS_QUERY_KEY(toValue(username)!, toValue(full))),
        queryFn: () => studentController.getQuestions(toValue(username)!, toValue(full)),
        enabled: () => !!toValue(username),
    });
}

export function useCreateStudentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => studentController.createStudent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
        onError: (err) => {
            alert("Create student failed:", err);
        },
    });
}

// TODO
// setquerydata
// previous students
export function useDeleteStudentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (username: string) => studentController.deleteStudent(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
        onError: (err) => {
            alert("Delete student failed:", err);
        },
    });
}
