import {BaseController} from "@/controllers/base-controller.ts";

export class StudentController extends BaseController {
    constructor() {
        super("students");
    }

    getAll(full = true) {
        return this.get<{ students: any[] }>("/", { full });
    }

    getByUsername(username: string) {
        return this.get<any>(`/${username}`);
    }

    createStudent(data: any) {
        return this.post<any>("/", data);
    }

    deleteStudent(username: string) {
        return this.delete<any>(`/${username}`);
    }

    getClasses(username: string, full = true) {
        return this.get<{ classes: any[] }>(`/${username}/classes`, { full });
    }

    getAssignments(username: string, full = true) {
        return this.get<{ assignments: any[] }>(`/${username}/assignments`, { full });
    }

    getGroups(username: string, full = true) {
        return this.get<{ groups: any[] }>(`/${username}/groups`, { full });
    }

    getSubmissions(username: string) {
        return this.get<{ submissions: any[] }>(`/${username}/submissions`);
    }

    getQuestions(username: string, full = true) {
        return this.get<{ questions: any[] }>(`/${username}/questions`, { full });
    }

}
