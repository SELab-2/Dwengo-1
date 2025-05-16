import { Cascade, Collection, Entity, Enum, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Teacher } from '../users/teacher.entity.js';
import { LearningPathRepository } from '../../data/content/learning-path-repository.js';
import { LearningPathNode } from './learning-path-node.entity.js';
import { Language } from '@dwengo-1/common/util/language';

@Entity({ repository: () => LearningPathRepository })
export class LearningPath {
    @PrimaryKey({ type: 'string' })
    hruid!: string;

    @Enum({ items: () => Language, primary: true })
    language!: Language;

    @ManyToMany({ entity: () => Teacher })
    admins!: Teacher[];

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'blob', nullable: true })
    image: Buffer | null = null;

    @OneToMany({ entity: () => LearningPathNode, mappedBy: 'learningPath', cascade: [Cascade.ALL] })
    nodes: Collection<LearningPathNode> = new Collection<LearningPathNode>(this);
}
