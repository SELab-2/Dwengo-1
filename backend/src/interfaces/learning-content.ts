import { Language } from '../entities/content/language';

export interface Transition {
    default: boolean;
    _id: string;
    next: {
        _id: string;
        hruid: string;
        version: number;
        language: string;
    };
}

export interface LearningObjectIdentifier {
    hruid: string;
    language: Language;
    version?: number;
}

export interface LearningObjectNode {
    _id: string;
    learningobject_hruid: string;
    version: number;
    language: Language;
    start_node?: boolean;
    transitions: Transition[];
    created_at: string;
    updatedAt: string;
    done?: boolean; // true if a submission exists for this node by the user for whom the learning path is customized.
}

export interface LearningPath {
    _id: string;
    language: string;
    hruid: string;
    title: string;
    description: string;
    image?: string; // Image might be missing, so it's optional
    num_nodes: number;
    num_nodes_left: number;
    nodes: LearningObjectNode[];
    keywords: string;
    target_ages: number[];
    min_age: number;
    max_age: number;
    __order: number;
}

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

export interface FilteredLearningObject {
    key: string;
    _id: string;
    uuid: string;
    version: number;
    title: string;
    htmlUrl: string;
    language: Language;
    difficulty: number;
    estimatedTime: number;
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

export interface LearningPathResponse {
    success: boolean;
    source: string;
    data: LearningPath[] | null;
    message?: string;
}
