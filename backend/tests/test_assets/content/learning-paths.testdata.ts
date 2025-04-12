import { EntityManager } from '@mikro-orm/core';
import { LearningPath } from '../../../src/entities/content/learning-path.entity';
import { Language } from '@dwengo-1/common/util/language';
import { LearningPathTransition } from '../../../src/entities/content/learning-path-transition.entity';
import { LearningPathNode } from '../../../src/entities/content/learning-path-node.entity';

let learningPath01: LearningPath;
let learningPath02: LearningPath;

export let TEST_LEARNING_PATH_LIST: LearningPath[];

export function makeTestLearningPaths(em: EntityManager): LearningPath[] {
    const node01 = new LearningPathNode();
    const node02 = new LearningPathNode();
    const node03 = new LearningPathNode();
    const node04 = new LearningPathNode();
    const node05 = new LearningPathNode();

    const transition01 = new LearningPathTransition();
    const transition02 = new LearningPathTransition();
    const transition03 = new LearningPathTransition();
    const transition04 = new LearningPathTransition();
    const transition05 = new LearningPathTransition();

    transition01.condition = 'true';
    transition01.next = node02;

    transition02.condition = 'true';
    transition02.next = node02;

    transition03.condition = 'true';
    transition03.next = node04;

    transition04.condition = 'true';
    transition04.next = node05;

    transition05.condition = 'true';
    transition05.next = node05;

    node01.instruction = '';
    node01.language = Language.English;
    node01.learningObjectHruid = 'id01';
    node01.startNode = true;
    node01.transitions = [transition01];
    node01.version = 1;

    node02.instruction = '';
    node02.language = Language.English;
    node02.learningObjectHruid = 'id02';
    node02.startNode = false;
    node02.transitions = [transition02];
    node02.version = 1;

    node03.instruction = '';
    node03.language = Language.English;
    node03.learningObjectHruid = 'id03';
    node03.startNode = true;
    node03.transitions = [transition03];
    node03.version = 1;

    node04.instruction = '';
    node04.language = Language.English;
    node04.learningObjectHruid = 'id04';
    node04.startNode = false;
    node04.transitions = [transition04];
    node04.version = 1;

    node05.instruction = '';
    node05.language = Language.English;
    node05.learningObjectHruid = 'id05';
    node05.startNode = false;
    node05.transitions = [transition05];
    node05.version = 1;

    learningPath01 = em.create(LearningPath, {
        hruid: 'id01',
        language: Language.English,
        admins: [],
        title: 'repertoire Tool',
        description: 'all about Tool',
        image: null,
        nodes: [node01, node02],
    });

    learningPath02 = em.create(LearningPath, {
        hruid: 'id02',
        language: Language.English,
        admins: [],
        title: 'repertoire Dire Straits',
        description: 'all about Dire Straits',
        image: null,
        nodes: [node03, node04, node05],
    });

    TEST_LEARNING_PATH_LIST = [learningPath01, learningPath02];
    return TEST_LEARNING_PATH_LIST;
}
