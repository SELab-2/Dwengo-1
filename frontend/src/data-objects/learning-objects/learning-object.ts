import type {Language} from "@/data-objects/language.ts";
import type {ReturnValue} from "@/data-objects/learning-objects/return-value.ts";
import type {EducationalGoal} from "@/data-objects/learning-objects/educational-goal.ts";

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
