import { EntityManager } from '@mikro-orm/core';
import { Language } from 'dwengo-1-common/src/util/language';
import { LearningPath } from '../../../src/entities/content/learning-path.entity';
import { LearningPathTransition } from '../../../src/entities/content/learning-path-transition.entity';
import { LearningPathNode } from '../../../src/entities/content/learning-path-node.entity';

export function makeTestLearningPaths(em: EntityManager): LearningPath[] {
    const learningPathNode01: LearningPathNode = new LearningPathNode();
    const learningPathNode02: LearningPathNode = new LearningPathNode();
    const learningPathNode03: LearningPathNode = new LearningPathNode();
    const learningPathNode04: LearningPathNode = new LearningPathNode();
    const learningPathNode05: LearningPathNode = new LearningPathNode();

    const transitions01: LearningPathTransition = new LearningPathTransition();
    const transitions02: LearningPathTransition = new LearningPathTransition();
    const transitions03: LearningPathTransition = new LearningPathTransition();
    const transitions04: LearningPathTransition = new LearningPathTransition();
    const transitions05: LearningPathTransition = new LearningPathTransition();

    transitions01.condition = 'true';
    transitions01.next = learningPathNode02;

    transitions02.condition = 'true';
    transitions02.next = learningPathNode02;

    transitions03.condition = 'true';
    transitions03.next = learningPathNode04;

    transitions04.condition = 'true';
    transitions04.next = learningPathNode05;

    transitions05.condition = 'true';
    transitions05.next = learningPathNode05;

    learningPathNode01.instruction = '';
    learningPathNode01.language = Language.English;
    learningPathNode01.learningObjectHruid = 'id01';
    learningPathNode01.startNode = true;
    learningPathNode01.transitions = [transitions01];
    learningPathNode01.version = 1;

    learningPathNode02.instruction = '';
    learningPathNode02.language = Language.English;
    learningPathNode02.learningObjectHruid = 'id02';
    learningPathNode02.startNode = false;
    learningPathNode02.transitions = [transitions02];
    learningPathNode02.version = 1;

    learningPathNode03.instruction = '';
    learningPathNode03.language = Language.English;
    learningPathNode03.learningObjectHruid = 'id03';
    learningPathNode03.startNode = true;
    learningPathNode03.transitions = [transitions03];
    learningPathNode03.version = 1;

    learningPathNode04.instruction = '';
    learningPathNode04.language = Language.English;
    learningPathNode04.learningObjectHruid = 'id04';
    learningPathNode04.startNode = false;
    learningPathNode04.transitions = [transitions04];
    learningPathNode04.version = 1;

    learningPathNode05.instruction = '';
    learningPathNode05.language = Language.English;
    learningPathNode05.learningObjectHruid = 'id05';
    learningPathNode05.startNode = false;
    learningPathNode05.transitions = [transitions05];
    learningPathNode05.version = 1;

    const nodes01: LearningPathNode[] = [
        // LearningPathNode01,
        // LearningPathNode02,
    ];
    const learningPath01 = em.create(LearningPath, {
        hruid: 'id01',
        language: Language.English,
        admins: [],
        title: 'repertoire Tool',
        description: 'all about Tool',
        image: null,
        nodes: nodes01,
    });

    const nodes02: LearningPathNode[] = [
        // LearningPathNode03,
        // LearningPathNode04,
        // LearningPathNode05,
    ];
    const learningPath02 = em.create(LearningPath, {
        hruid: 'id02',
        language: Language.English,
        admins: [],
        title: 'repertoire Dire Straits',
        description: 'all about Dire Straits',
        image: null,
        nodes: nodes02,
    });

    return [learningPath01, learningPath02];
}
