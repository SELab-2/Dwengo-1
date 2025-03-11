import { Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from './language';
import { LearningPath } from './learning-path.entity';
import { LearningPathTransition } from './learning-path-transition.entity';

@Entity()
export class LearningPathNode {
    @ManyToOne({ entity: () => LearningPath, primary: true })
    learningPath!: LearningPath;

    @PrimaryKey({ type: 'integer', autoincrement: true })
    nodeNumber!: number;

    @Property({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({ items: () => Language })
    language!: Language;

    @Property({ type: 'number' })
    version!: number;

    @Property({ type: 'text', nullable: true })
    instruction?: string;

    @Property({ type: 'bool' })
    startNode!: boolean;

    @OneToMany({ entity: () => LearningPathTransition, mappedBy: 'node' })
    transitions: LearningPathTransition[] = [];

    @Property({ length: 3 })
    createdAt: Date = new Date();

    @Property({ length: 3, onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
