import type {Language} from "@/services/learning-paths/language.ts";

export interface LearningPath {
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

export interface LearningObjectNode {
    _id: string;
    learningobject_hruid: string;
    version: number;
    language: Language;
    start_node?: boolean;
    transitions: Transition[];
    created_at: string;
    updatedAt: string;
    done?: boolean; // True if a submission exists for this node by the user for whom the learning path is customized.
}

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
