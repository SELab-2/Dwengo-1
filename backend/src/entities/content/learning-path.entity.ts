import {
    Embeddable,
    Embedded,
    Entity,
    Enum,
    ManyToMany,
    OneToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Language } from './language';
import { Teacher } from '../users/teacher.entity';

@Entity()
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

    @Property({ type: 'blob' })
    image!: string;

    @Embedded({ entity: () => LearningPathNode, array: true })
    nodes: LearningPathNode[] = [];
}

@Embeddable()
export class LearningPathNode {
    @Property({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({ items: () => Language })
    language!: Language;

    @Property({ type: 'string' })
    version!: string;

    @Property({ type: 'longtext' })
    instruction!: string;

    @Property({ type: 'bool' })
    startNode!: boolean;

    @Embedded({ entity: () => LearningPathTransition, array: true })
    transitions!: LearningPathTransition[];
}

@Embeddable()
export class LearningPathTransition {
    @Property({ type: 'string' })
    condition!: string;

    @OneToOne({ entity: () => LearningPathNode })
    next!: LearningPathNode;
}
