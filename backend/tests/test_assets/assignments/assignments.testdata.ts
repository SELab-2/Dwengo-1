import { EntityManager } from '@mikro-orm/core';
import { Language } from 'dwengo-1-common/src/util/language';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { Class } from '../../../src/entities/classes/class.entity';

export function makeTestAssignemnts(em: EntityManager, classes: Class[]): Assignment[] {
    const assignment01 = em.create(Assignment, {
        within: classes[0],
        id: 1,
        title: 'dire straits',
        description: 'reading',
        learningPathHruid: 'id02',
        learningPathLanguage: Language.English,
        groups: [],
    });

    const assignment02 = em.create(Assignment, {
        within: classes[1],
        id: 2,
        title: 'tool',
        description: 'reading',
        learningPathHruid: 'id01',
        learningPathLanguage: Language.English,
        groups: [],
    });

    const assignment03 = em.create(Assignment, {
        within: classes[0],
        id: 3,
        title: 'delete',
        description: 'will be deleted',
        learningPathHruid: 'id02',
        learningPathLanguage: Language.English,
        groups: [],
    });

    return [assignment01, assignment02, assignment03];
}
