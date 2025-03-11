import { AssertionError } from 'node:assert';
import { LearningObject } from '../../src/entities/content/learning-object.entity';
import { FilteredLearningObject, LearningPath } from '../../src/interfaces/learning-content';
import { LearningPath as LearningPathEntity } from '../../src/entities/content/learning-path.entity';
import { expect } from 'vitest';

// Ignored properties because they belang for example to the class, not to the entity itself.
const IGNORE_PROPERTIES = ['parent'];

/**
 * Checks if the actual entity from the database conforms to the entity that was added previously.
 * @param actual The actual entity retrieved from the database
 * @param expected The (previously added) entity we would expect to retrieve
 */
export function expectToBeCorrectEntity<T extends object>(actual: { entity: T; name?: string }, expected: { entity: T; name?: string }): void {
    if (!actual.name) {
        actual.name = 'actual';
    }
    if (!expected.name) {
        expected.name = 'expected';
    }
    for (const property in expected.entity) {
        if (
            property! in IGNORE_PROPERTIES &&
            expected.entity[property] !== undefined && // If we don't expect a certain value for a property, we assume it can be filled in by the database however it wants.
            typeof expected.entity[property] !== 'function' // Functions obviously are not persisted via the database
        ) {
            if (!actual.entity.hasOwnProperty(property)) {
                throw new AssertionError({
                    message: `${expected.name} has defined property ${property}, but ${actual.name} is missing it.`,
                });
            }
            if (typeof expected.entity[property] === 'boolean') {
                // Sometimes, booleans get represented by numbers 0 and 1 in the objects actual from the database.
                if (Boolean(expected.entity[property]) !== Boolean(actual.entity[property])) {
                    throw new AssertionError({
                        message: `${property} was ${expected.entity[property]} in ${expected.name},
                        but ${actual.entity[property]} (${Boolean(expected.entity[property])}) in ${actual.name}`,
                    });
                }
            } else if (typeof expected.entity[property] !== typeof actual.entity[property]) {
                throw new AssertionError({
                    message: `${property} has type ${typeof expected.entity[property]} in ${expected.name}, but type ${typeof actual.entity[property]} in ${actual.name}.`,
                });
            } else if (typeof expected.entity[property] === 'object') {
                expectToBeCorrectEntity(
                    {
                        name: actual.name + '.' + property,
                        entity: actual.entity[property] as object,
                    },
                    {
                        name: expected.name + '.' + property,
                        entity: expected.entity[property] as object,
                    }
                );
            } else {
                if (expected.entity[property] !== actual.entity[property]) {
                    throw new AssertionError({
                        message: `${property} was ${expected.entity[property]} in ${expected.name}, but ${actual.entity[property]} in ${actual.name}`,
                    });
                }
            }
        }
    }
}

/**
 * Checks that filtered is the correct representation of original as FilteredLearningObject.
 * @param filtered the representation as FilteredLearningObject
 * @param original the original entity added to the database
 */
export function expectToBeCorrectFilteredLearningObject(filtered: FilteredLearningObject, original: LearningObject) {
    expect(filtered.uuid).toEqual(original.uuid);
    expect(filtered.version).toEqual(original.version);
    expect(filtered.language).toEqual(original.language);
    expect(filtered.keywords).toEqual(original.keywords);
    expect(filtered.key).toEqual(original.hruid);
    expect(filtered.targetAges).toEqual(original.targetAges);
    expect(filtered.title).toEqual(original.title);
    expect(Boolean(filtered.teacherExclusive)).toEqual(Boolean(original.teacherExclusive));
    expect(filtered.skosConcepts).toEqual(original.skosConcepts);
    expect(filtered.estimatedTime).toEqual(original.estimatedTime);
    expect(filtered.educationalGoals).toEqual(original.educationalGoals);
    expect(filtered.difficulty).toEqual(original.difficulty || 1);
    expect(filtered.description).toEqual(original.description);
    expect(filtered.returnValue?.callback_url).toEqual(original.returnValue.callbackUrl);
    expect(filtered.returnValue?.callback_schema).toEqual(JSON.parse(original.returnValue.callbackSchema));
    expect(filtered.contentType).toEqual(original.contentType);
    expect(filtered.contentLocation || null).toEqual(original.contentLocation || null);
    expect(filtered.htmlUrl).toContain(`/${original.hruid}/html`);
    expect(filtered.htmlUrl).toContain(`language=${original.language}`);
    expect(filtered.htmlUrl).toContain(`version=${original.version}`);
}

/**
 * Check that a learning path returned by a LearningPathRetriever, the LearningPathService or an API endpoint
 * is a correct representation of the given learning path entity.
 *
 * @param learningPath The learning path returned by the retriever, service or endpoint
 * @param expectedEntity The expected entity
 * @param learningObjectsOnPath The learning objects on LearningPath. Necessary since some information in
 *                              the learning path returned from the API endpoint
 */
export function expectToBeCorrectLearningPath(
    learningPath: LearningPath,
    expectedEntity: LearningPathEntity,
    learningObjectsOnPath: FilteredLearningObject[]
) {
    expect(learningPath.hruid).toEqual(expectedEntity.hruid);
    expect(learningPath.language).toEqual(expectedEntity.language);
    expect(learningPath.description).toEqual(expectedEntity.description);
    expect(learningPath.title).toEqual(expectedEntity.title);

    const keywords = new Set(learningObjectsOnPath.flatMap((it) => it.keywords || []));
    expect(new Set(learningPath.keywords.split(' '))).toEqual(keywords);

    const targetAges = new Set(learningObjectsOnPath.flatMap((it) => it.targetAges || []));
    expect(new Set(learningPath.target_ages)).toEqual(targetAges);
    expect(learningPath.min_age).toEqual(Math.min(...targetAges));
    expect(learningPath.max_age).toEqual(Math.max(...targetAges));

    expect(learningPath.num_nodes).toEqual(expectedEntity.nodes.length);
    expect(learningPath.image || null).toEqual(expectedEntity.image);

    const expectedLearningPathNodes = new Map(
        expectedEntity.nodes.map((node) => [
            { learningObjectHruid: node.learningObjectHruid, language: node.language, version: node.version },
            { startNode: node.startNode, transitions: node.transitions },
        ])
    );

    for (const node of learningPath.nodes) {
        const nodeKey = {
            learningObjectHruid: node.learningobject_hruid,
            language: node.language,
            version: node.version,
        };
        expect(expectedLearningPathNodes.keys()).toContainEqual(nodeKey);
        const expectedNode = [...expectedLearningPathNodes.entries()].filter(
            ([key, _]) => key.learningObjectHruid === nodeKey.learningObjectHruid && key.language === node.language && key.version === node.version
        )[0][1];
        expect(node.start_node).toEqual(expectedNode?.startNode);

        expect(new Set(node.transitions.map((it) => it.next.hruid))).toEqual(
            new Set(expectedNode.transitions.map((it) => it.next.learningObjectHruid))
        );
        expect(new Set(node.transitions.map((it) => it.next.language))).toEqual(new Set(expectedNode.transitions.map((it) => it.next.language)));
        expect(new Set(node.transitions.map((it) => it.next.version))).toEqual(new Set(expectedNode.transitions.map((it) => it.next.version)));
    }
}
