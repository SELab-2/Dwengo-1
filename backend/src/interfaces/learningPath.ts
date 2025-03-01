export interface LearningPathResponse {
    success: boolean;
    source: string;
    data: any[] | null;
    message?: string;
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


interface LearningObjectNode {
    _id: string;
    learningobject_hruid: string;
    version: number;
    language: string;
    start_node?: boolean;
    transitions: Transition[];
    created_at: string;
    updatedAt: string;
}

interface Transition {
    default: boolean;
    _id: string;
    next: {
        _id: string;
        hruid: string;
        version: number;
        language: string;
    };
}
