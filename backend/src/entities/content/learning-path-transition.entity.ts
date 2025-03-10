import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {LearningPathNode} from "./learning-path-node.entity";

@Entity()
export class LearningPathTransition {
    @ManyToOne({entity: () => LearningPathNode, primary: true })
    node!: LearningPathNode;

    @PrimaryKey({ type: 'numeric' })
    transitionNumber!: number;

    @Property({ type: 'string' })
    condition!: string;

    @ManyToOne({ entity: () => LearningPathNode })
    next!: LearningPathNode;
}
