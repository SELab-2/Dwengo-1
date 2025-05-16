import { BaseController } from "@/controllers/base-controller.ts";
import type { Language } from "@/data-objects/language.ts";
import { LearningPath } from "@/data-objects/learning-paths/learning-path";
import { NotFoundException } from "@/exception/not-found-exception";
import type { LearningPath as LearningPathDTO } from "@dwengo-1/common/interfaces/learning-content";

export class LearningPathController extends BaseController {
    constructor() {
        super("learningPath");
    }
    async search(query: string, language: string): Promise<LearningPath[]> {
        const dtos = await this.get<LearningPathDTO[]>("/", { search: query, language });
        return dtos.map((dto) => LearningPath.fromDTO(dto));
    }
    async getBy(
        hruid: string,
        language: Language,
        forGroup?: { forGroup: number; assignmentNo: number; classId: string },
    ): Promise<LearningPath> {
        const dtos = await this.get<LearningPathDTO[]>("/", {
            hruid,
            language,
            forGroup: forGroup?.forGroup,
            assignmentNo: forGroup?.assignmentNo,
            classId: forGroup?.classId,
        });
        if (dtos.length === 0) {
            throw new NotFoundException("learningPathNotFound");
        }
        return LearningPath.fromDTO(dtos[0]);
    }
    async getAllByThemeAndLanguage(theme: string, language: Language): Promise<LearningPath[]> {
        const dtos = await this.get<LearningPathDTO[]>("/", { theme, language });
        return dtos.map((dto) => LearningPath.fromDTO(dto));
    }

    async getAllLearningPaths(language: string | null = null): Promise<LearningPath[]> {
        const query = language ? { language } : undefined;
        const dtos = await this.get<LearningPathDTO[]>("/", query);
        return dtos.map((dto) => LearningPath.fromDTO(dto));
    }

    async getAllByAdminRaw(admin: string): Promise<LearningPathDTO[]> {
        return await this.get<LearningPathDTO[]>("/", { admin });
    }

    async postLearningPath(learningPath: Partial<LearningPathDTO>): Promise<LearningPathDTO> {
        return await this.post<LearningPathDTO>("/", learningPath);
    }

    async putLearningPath(learningPath: Partial<LearningPathDTO>): Promise<LearningPathDTO> {
        return await this.put<LearningPathDTO>(`/${learningPath.hruid}/${learningPath.language}`, learningPath);
    }

    async deleteLearningPath(hruid: string, language: string): Promise<LearningPathDTO> {
        return await this.delete<LearningPathDTO>(`/${hruid}/${language}`);
    }
}
