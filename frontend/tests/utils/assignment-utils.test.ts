import { LearningPathNode } from "@dwengo-1/backend/dist/entities/content/learning-path-node.entity";
import { calculateProgress } from "../../src/utils/assignment-utils";
import { LearningPath } from "../../src/data-objects/learning-paths/learning-path";
import { describe, it, expect } from "vitest";

describe("calculateProgress", () => {
    it("should return 0 when no nodes are completed", () => {
        const lp = new LearningPath({
            language: "en",
            hruid: "test-path",
            title: "Test Path",
            description: "Test Description",
            amountOfNodes: 10,
            amountOfNodesLeft: 10,
            keywords: ["test"],
            targetAges: { min: 10, max: 15 },
            startNode: {} as LearningPathNode,
        });

        expect(calculateProgress(lp)).toBe(0);
    });

    it("should return 100 when all nodes are completed", () => {
        const lp = new LearningPath({
            language: "en",
            hruid: "test-path",
            title: "Test Path",
            description: "Test Description",
            amountOfNodes: 10,
            amountOfNodesLeft: 0,
            keywords: ["test"],
            targetAges: { min: 10, max: 15 },
            startNode: {} as LearningPathNode,
        });

        expect(calculateProgress(lp)).toBe(100);
    });

    it("should return 50 when half of the nodes are completed", () => {
        const lp = new LearningPath({
            language: "en",
            hruid: "test-path",
            title: "Test Path",
            description: "Test Description",
            amountOfNodes: 10,
            amountOfNodesLeft: 5,
            keywords: ["test"],
            targetAges: { min: 10, max: 15 },
            startNode: {} as LearningPathNode,
        });

        expect(calculateProgress(lp)).toBe(50);
    });

    it("should handle floating point progress correctly", () => {
        const lp = new LearningPath({
            language: "en",
            hruid: "test-path",
            title: "Test Path",
            description: "Test Description",
            amountOfNodes: 3,
            amountOfNodesLeft: 1,
            keywords: ["test"],
            targetAges: { min: 10, max: 15 },
            startNode: {} as LearningPathNode,
        });

        expect(calculateProgress(lp)).toBeCloseTo(66.666, 2);
    });

    it("should handle edge case where amountOfNodesLeft is negative", () => {
        const lp = new LearningPath({
            language: "en",
            hruid: "test-path",
            title: "Test Path",
            description: "Test Description",
            amountOfNodes: 10,
            amountOfNodesLeft: -5,
            keywords: ["test"],
            targetAges: { min: 10, max: 15 },
            startNode: {} as LearningPathNode,
        });

        expect(calculateProgress(lp)).toBe(150);
    });
});
