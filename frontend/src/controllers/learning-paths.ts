import {BaseController} from "@/controllers/base-controller.ts";
import {LearningPath} from "@/data-objects/learning-path.ts";
import type {LearningPathDTO} from "@/data-objects/learning-path.ts";
import type {Language} from "@/data-objects/language.ts";
import {single} from "@/utils/response-assertions.ts";

export class LearningPathController extends BaseController {
    constructor() {
        super("learningPath");
    }
    async search(query: string) {
        let dtos = await this.get<LearningPathDTO[]>("/", {search: query});
        return dtos.map(dto => LearningPath.fromDTO(dto));
    }
    async getBy(hruid: string, language: Language, options?: {forGroup?: string, forStudent?: string}) {
        let dtos = await this.get<LearningPathDTO[]>("/", {
            hruid,
            language,
            forGroup: options?.forGroup,
            forStudent: options?.forStudent
        });
        return LearningPath.fromDTO(single(dtos));
    }
    async getAllByTheme(theme: string) {
        let dtos = await this.get<LearningPathDTO[]>("/", {theme});
        return dtos.map(dto => LearningPath.fromDTO(dto));
    }
}
