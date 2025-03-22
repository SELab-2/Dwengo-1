import type {Language} from "@/services/learning-paths/language.ts";

export interface LearningPathIdentifier {
    hruid: string;
    language: Language;
}

export interface EducationalGoal {
    source: string;
    id: string;
}

export interface ReturnValue {
    callback_url: string;
    callback_schema: Record<string, any>;
}

export interface LearningObjectMetadata {
    _id: string;
    uuid: string;
    hruid: string;
    version: number;
    language: Language;
    title: string;
    description: string;
    difficulty: number;
    estimated_time: number;
    available: boolean;
    teacher_exclusive: boolean;
    educational_goals: EducationalGoal[];
    keywords: string[];
    target_ages: number[];
    content_type: string; // Markdown, image, etc.
    content_location?: string;
    skos_concepts?: string[];
    return_value?: ReturnValue;
}
