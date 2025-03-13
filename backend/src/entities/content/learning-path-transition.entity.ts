import { Entity, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import { LearningPathNode } from './learning-path-node.entity.js';

@Entity()
export class LearningPathTransition {
    @ManyToOne({ entity: () => LearningPathNode, primary: true })
    node!: Rel<LearningPathNode>;

    @PrimaryKey({ type: 'numeric' })
    transitionNumber!: number;

    @Property({ type: 'string' })
    condition!: string;

    @ManyToOne({ entity: () => LearningPathNode })
    next!: Rel<LearningPathNode>;
}
