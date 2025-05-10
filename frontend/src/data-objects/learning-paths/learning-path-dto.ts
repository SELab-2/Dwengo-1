import type { LearningPathNodeDTO } from "@/data-objects/learning-paths/learning-path.ts";

export interface LearningPathDTO {
    language: string;
    hruid: string;
    title: string;
    description: string;
    image?: string; // Image might be missing, so it's optional
    num_nodes: number;
    num_nodes_left: number;
    nodes: LearningPathNodeDTO[];
    keywords: string;
    target_ages: number[];
    min_age: number;
    max_age: number;
    __order: number;
}
