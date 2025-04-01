import type {Language} from "@/data-objects/language.ts";
import type {LearningPathNodeDTO} from "@/data-objects/learning-paths/learning-path.ts";

export class LearningPathNode {
    public readonly learningobjectHruid: string;
    public readonly version: number;
    public readonly language: Language;
    public readonly transitions: { next: LearningPathNode, default: boolean }[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly done: boolean;

    constructor(options: {
        learningobjectHruid: string,
        version: number,
        language: Language,
        transitions: { next: LearningPathNode, default: boolean }[],
        createdAt: Date,
        updatedAt: Date,
        done?: boolean
    }) {
        this.learningobjectHruid = options.learningobjectHruid;
        this.version = options.version;
        this.language = options.language;
        this.transitions = options.transitions;
        this.createdAt = options.createdAt;
        this.updatedAt = options.updatedAt;
        this.done = options.done || false;
    }

    static fromDTOAndOtherNodes(dto: LearningPathNodeDTO, otherNodes: LearningPathNodeDTO[]): LearningPathNode {
        return new LearningPathNode({
            learningobjectHruid: dto.learningobject_hruid,
            version: dto.version,
            language: dto.language,
            transitions: dto.transitions.map(transDto => {
                const nextNodeDto = otherNodes.filter(it =>
                    it.learningobject_hruid === transDto.next.hruid
                    && it.language === transDto.next.language
                    && it.version === transDto.next.version
                );
                if (nextNodeDto.length !== 1) {
                    throw new Error(`Invalid learning path! There is a transition to node`
                        + `${transDto.next.hruid}/${transDto.next.language}/${transDto.next.version}, but there are`
                        + `${nextNodeDto.length} such nodes.`);
                }
                return {
                    next: LearningPathNode.fromDTOAndOtherNodes(nextNodeDto[0], otherNodes),
                    default: transDto.default
                }
            }),
            createdAt: new Date(dto.created_at),
            updatedAt: new Date(dto.updatedAt),
            done: dto.done
        })
    }
}
