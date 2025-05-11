import { BaseController } from "@/controllers/base-controller.ts";
import type { Language } from "@/data-objects/language.ts";
import type { LearningObject } from "@/data-objects/learning-objects/learning-object.ts";

export class LearningObjectController extends BaseController {
    constructor() {
        super("learningObject");
    }

    async getMetadata(hruid: string, language: Language, version: number): Promise<LearningObject> {
        return this.get<LearningObject>(`/${hruid}`, { language, version });
    }

    async getHTML(hruid: string, language: Language, version: number): Promise<Document> {
        return this.get<Document>(`/${hruid}/html`, { language, version }, "document");
    }

    async getAllAdministratedBy(admin: string): Promise<LearningObject[]> {
        return this.get<LearningObject[]>("/", { admin });
    }

    async upload(learningObjectZip: File): Promise<LearningObject> {
        return this.postFile<LearningObject>("/", "learningObject", learningObjectZip);
    }
}
