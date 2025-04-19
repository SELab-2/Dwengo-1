import { BaseController } from "@/controllers/base-controller.ts";
import { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
import type { Language } from "@/data-objects/language.ts";
import { single } from "@/utils/response-assertions.ts";
import type { LearningPathDTO } from "@/data-objects/learning-paths/learning-path-dto.ts";

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
        return LearningPath.fromDTO(single(dtos));
    }
    async getAllByTheme(theme: string): Promise<LearningPath[]> {
        const dtos = await this.get<LearningPathDTO[]>("/", { theme });
        return dtos.map((dto) => LearningPath.fromDTO(dto));
    }

    async getAllLearningPaths(language: string | null = null): Promise<LearningPath[]> {
        const query = language ? { language } : undefined;
        const dtos = await this.get<LearningPathDTO[]>("/", query);
        return dtos.map((dto) => LearningPath.fromDTO(dto));
    }
}
