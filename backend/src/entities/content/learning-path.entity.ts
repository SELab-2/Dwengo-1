import {Embeddable, Embedded, Entity, Enum, OneToOne, Property} from "@mikro-orm/core";
import {Language} from "./language";

@Entity()
export class LearningPath {
    @Enum({items: () => Language})
    language!: Language;

    @Property({type: "string"})
    title!: string;

    @Property({type: "longtext"})
    description!: string;

    @Property({type: "blob"})
    image!: string;

    @Embedded({entity: () => LearningPathNode, array: true})
    nodes: LearningPathNode[];
}

@Embeddable()
export class LearningPathNode {
    @Property({type: "string"})
    learningObjectHruid!: string;

    @Enum({items: () => Language})
    language!: Language;

    @Property({type: "string"})
    version!: string;

    @Property({type: "longtext"})
    instruction!: string;

    @Property({type: "bool"})
    startNode!: boolean;

    @Embedded({entity: () => LearningPathTransition, array: true})
    transitions!: LearningPathTransition[];
}

@Embeddable()
export class LearningPathTransition {
    @Property({type: "string"})
    condition!: string;

    @OneToOne({entity: () => LearningPathNode})
    next!: LearningPathNode;
}
