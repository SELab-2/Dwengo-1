import type { Language } from "@/data-objects/language.ts";
import type { LearningObjectNode as LearningPathNodeDTO } from "@dwengo-1/common/interfaces/learning-content";

export class LearningPathNode {
    public readonly learningobjectHruid: string;
    public readonly version: number;
    public readonly language: Language;
    public readonly transitions: { next: LearningPathNode; default: boolean }[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly done: boolean;

    constructor(options: {
        learningobjectHruid: string;
        version: number;
        language: Language;
        transitions: { next: LearningPathNode; default?: boolean }[];
        createdAt: Date;
        updatedAt: Date;
        done?: boolean;
    }) {
        this.learningobjectHruid = options.learningobjectHruid;
        this.version = options.version;
        this.language = options.language;
        this.transitions = options.transitions.map((it) => ({ next: it.next, default: it.default ?? false }));
        this.createdAt = options.createdAt;
        this.updatedAt = options.updatedAt;
        this.done = options.done || false;
    }

    static fromDTOAndOtherNodes(dto: LearningPathNodeDTO, otherNodes: LearningPathNodeDTO[]): LearningPathNode {
        return new LearningPathNode({
            learningobjectHruid: dto.learningobject_hruid,
            version: dto.version,
            language: dto.language,
            transitions: dto.transitions
                .map((transDto) => {
                    const nextNodeDto = otherNodes.find(
                        (it) =>
                            it.learningobject_hruid === transDto.next.hruid &&
                            it.language === transDto.next.language &&
                            it.version === transDto.next.version,
                    );
                    if (nextNodeDto) {
                        return {
                            next: LearningPathNode.fromDTOAndOtherNodes(nextNodeDto, otherNodes),
                            default: transDto.default,
                        };
                    }
                    return undefined;
                })
                .filter((it) => it !== undefined),
            createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
            updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
            done: dto.done,
        });
    }
}
