import type {LearningPath} from "@/data-objects/learning-paths/learning-path.ts";

export function calculateProgress(lp: LearningPath): number {
    return ((lp.amountOfNodes - lp.amountOfNodesLeft) / lp.amountOfNodes) * 100;
}
