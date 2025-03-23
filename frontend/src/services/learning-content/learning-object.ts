import type {Language} from "@/services/learning-content/language.ts";

export interface EducationalGoal {
    source: string;
    id: string;
}

export interface ReturnValue {
    callback_url: string;
    callback_schema: Record<string, any>;
}

export interface LearningObject {
    key: string;
    _id: string;
    uuid: string;
    version: number;
    title: string;
    htmlUrl: string;
    language: Language;
    difficulty: number;
    estimatedTime?: number;
    available: boolean;
    teacherExclusive: boolean;
    educationalGoals: EducationalGoal[];
    keywords: string[];
    description: string;
    targetAges: number[];
    contentType: string;
    contentLocation?: string;
    skosConcepts?: string[];
    returnValue?: ReturnValue;
}
