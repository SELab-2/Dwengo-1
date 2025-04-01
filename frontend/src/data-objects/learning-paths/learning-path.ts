import type { Language } from "@/data-objects/language.ts";
import { LearningPathNode } from "@/data-objects/learning-paths/learning-path-node.ts";
import type { LearningPathDTO } from "@/data-objects/learning-paths/learning-path-dto.ts";

export interface LearningPathNodeDTO {
    _id: string;
    learningobject_hruid: string;
    version: number;
    language: Language;
    start_node?: boolean;
    transitions: LearningPathTransitionDTO[];
    created_at: string;
    updatedAt: string;
    done?: boolean; // True if a submission exists for this node by the user for whom the learning path is customized.
}

export interface LearningPathTransitionDTO {
    default: boolean;
    _id: string;
    next: {
        _id: string;
        hruid: string;
        version: number;
        language: string;
    };
}

export class LearningPath {
    public readonly language: string;
    public readonly hruid: string;
    public readonly title: string;
    public readonly description: string;
    public readonly amountOfNodes: number;
    public readonly amountOfNodesLeft: number;
    public readonly keywords: string[];
    public readonly targetAges: { min: number; max: number };
    public readonly startNode: LearningPathNode;
    public readonly image?: string; // Image might be missing, so it's optional

    constructor(options: {
        language: string;
        hruid: string;
        title: string;
        description: string;
        amountOfNodes: number;
        amountOfNodesLeft: number;
        keywords: string[];
        targetAges: { min: number; max: number };
        startNode: LearningPathNode;
        image?: string; // Image might be missing, so it's optional
    }) {
        this.language = options.language;
        this.hruid = options.hruid;
        this.title = options.title;
        this.description = options.description;
        this.amountOfNodes = options.amountOfNodes;
        this.amountOfNodesLeft = options.amountOfNodesLeft;
        this.keywords = options.keywords;
        this.targetAges = options.targetAges;
        this.startNode = options.startNode;
        this.image = options.image;
    }

    public get nodesAsList(): LearningPathNode[] {
        const list: LearningPathNode[] = [];
        let currentNode = this.startNode;
        while (currentNode) {
            list.push(currentNode);
            currentNode = currentNode.transitions.find((it) => it.default)?.next || currentNode.transitions[0]?.next;
        }
        return list;
    }

    static fromDTO(dto: LearningPathDTO): LearningPath {
        const startNodeDto = dto.nodes.filter((it) => it.start_node === true);
        if (startNodeDto.length !== 1) {
            throw new Error(`Invalid learning path: ${dto.hruid}/${dto.language}!
                                Expected precisely one start node, but there were ${startNodeDto.length}.`);
        }
        return new LearningPath({
            language: dto.language,
            hruid: dto.hruid,
            title: dto.title,
            description: dto.description,
            amountOfNodes: dto.num_nodes,
            amountOfNodesLeft: dto.num_nodes_left,
            keywords: dto.keywords.split(" "),
            targetAges: { min: dto.min_age, max: dto.max_age },
            startNode: LearningPathNode.fromDTOAndOtherNodes(startNodeDto[0], dto.nodes),
            image: dto.image,
        });
    }
}
