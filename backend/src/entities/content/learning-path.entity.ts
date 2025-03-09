import {
    Entity,
    Enum,
    ManyToMany, OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Language } from './language.js';
import { Teacher } from '../users/teacher.entity.js';
import {LearningPathRepository} from "../../data/content/learning-path-repository";
import {LearningPathNode} from "./learning-path-node.entity";

@Entity({repository: () => LearningPathRepository})
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

    @OneToMany({ entity: () => LearningPathNode, mappedBy: "learningPath" })
    nodes: LearningPathNode[] = [];
}
