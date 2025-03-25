import type {Language} from "@/services/learning-content/language.ts";
import type {LearningObject} from "@/services/learning-content/learning-object.ts";
import {getLearningObjectMetadata} from "@/services/learning-content/learning-object-service.ts";

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

interface LearningPathNodeDTO {
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

interface LearningPathTransitionDTO {
    default: boolean;
    _id: string;
    next: {
        _id: string;
        hruid: string;
        version: number;
        language: string;
    };
}

export class LearningPathNode {

    constructor(
        public readonly learningobjectHruid: string,
        public readonly version: number,
        public readonly language: Language,
        public readonly transitions: {next: LearningPathNode, default: boolean}[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly done: boolean = false
    ) {
    }

    get learningObject(): Promise<LearningObject> {
        return getLearningObjectMetadata(this.learningobjectHruid, this.language, this.version);
    }

    static fromDTOAndOtherNodes(dto: LearningPathNodeDTO, otherNodes: LearningPathNodeDTO[]): LearningPathNode {
        return new LearningPathNode(
            dto.learningobject_hruid,
            dto.version,
            dto.language,
            dto.transitions.map(transDto => {
                let nextNodeDto = otherNodes.filter(it =>
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
            new Date(dto.created_at),
            new Date(dto.updatedAt),
            dto.done
        )
    }
}

export class LearningPath {
    constructor(
        public readonly language: string,
        public readonly hruid: string,
        public readonly title: string,
        public readonly description: string,
        public readonly amountOfNodes: number,
        public readonly amountOfNodesLeft: number,
        public readonly keywords: string[],
        public readonly targetAges: {min: number; max: number},
        public readonly startNode: LearningPathNode,
        public readonly image?: string // Image might be missing, so it's optional
    ) {
    }

    public get nodesAsList(): LearningPathNode[] {
        let list: LearningPathNode[] = [];
        let currentNode = this.startNode;
        while (currentNode) {
            list.push(currentNode);
            currentNode = currentNode.transitions.filter(it => it.default)[0]?.next
                            || currentNode.transitions[0]?.next;
        }
        return list;
    }

    public get learningObjectsAsList(): Promise<LearningObject[]> {
        return Promise.all(this.nodesAsList.map(node => node.learningObject));
    }

    static fromDTO(dto: LearningPathDTO): LearningPath {
        let startNodeDto = dto.nodes.filter(it => it.start_node === true);
        if (startNodeDto.length !== 1) {
            throw new Error(`Invalid learning path: ${dto.hruid}/${dto.language}!
                                Expected precisely one start node, but there were ${startNodeDto.length}.`);
        }
        return new LearningPath(
            dto.language,
            dto.hruid,
            dto.title,
            dto.description,
            dto.num_nodes,
            dto.num_nodes_left,
            dto.keywords.split(' '),
            {min: dto.min_age, max: dto.max_age},
            LearningPathNode.fromDTOAndOtherNodes(startNodeDto[0], dto.nodes),
            dto.image
        )
    }
}
