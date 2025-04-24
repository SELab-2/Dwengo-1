import { AssertionError } from 'node:assert';
import { LearningObject } from '../../src/entities/content/learning-object.entity';
import { expect } from 'vitest';
import { FilteredLearningObject, LearningPath } from '@dwengo-1/common/interfaces/learning-content';
import { RequiredEntityData } from '@mikro-orm/core';

// Ignored properties because they belang for example to the class, not to the entity itself.
const IGNORE_PROPERTIES = ['parent'];

/**
 * Checks if the actual entity from the database conforms to the entity that was added previously.
 * @param actual The actual entity retrieved from the database
 * @param expected The (previously added) entity we would expect to retrieve
 * @param propertyPrefix Prefix to append to property in error messages.
 */
export function expectToBeCorrectEntity<T extends object>(actual: T, expected: T, propertyPrefix = ''): void {
    for (const property in expected) {
        if (Object.prototype.hasOwnProperty.call(expected, property)) {
            const prefixedProperty = propertyPrefix + property;
            if (
                property in IGNORE_PROPERTIES &&
                expected[property] !== undefined && // If we don't expect a certain value for a property, we assume it can be filled in by the database however it wants.
                typeof expected[property] !== 'function' // Functions obviously are not persisted via the database
            ) {
                if (!Object.prototype.hasOwnProperty.call(actual, property)) {
                    throw new AssertionError({
                        message: `Expected property ${prefixedProperty}, but it is missing.`,
                    });
                }
                if (typeof expected[property] === 'boolean') {
                    // Sometimes, booleans get represented by numbers 0 and 1 in the objects actual from the database.
                    if (Boolean(expected[property]) !== Boolean(actual[property])) {
                        throw new AssertionError({
                            message: `Expected ${prefixedProperty} to be ${expected[property]},
                        but was ${actual[property]} (${Boolean(expected[property])}).`,
                        });
                    }
                } else if (typeof expected[property] !== typeof actual[property]) {
                    throw new AssertionError({
                        message:
                            `${prefixedProperty} was expected to have type ${typeof expected[property]},` +
                            `but had type ${typeof actual[property]}.`,
                    });
                } else if (typeof expected[property] === 'object') {
                    expectToBeCorrectEntity(actual[property] as object, expected[property] as object, property);
                } else {
                    if (expected[property] !== actual[property]) {
                        throw new AssertionError({
                            message: `${prefixedProperty} was expected to be ${expected[property]}, ` + `but was ${actual[property]}.`,
                        });
                    }
                }
            }
        }
    }
}

/**
 * Checks that filtered is the correct representation of original as FilteredLearningObject.
 * @param filtered the representation as FilteredLearningObject
 * @param original the data of the entity in the database that was filtered.
 */
export function expectToBeCorrectFilteredLearningObject(filtered: FilteredLearningObject, original: RequiredEntityData<LearningObject>): void {
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
 * @param expected The learning path that should have been returned.
 */
export function expectToBeCorrectLearningPath(learningPath: LearningPath, expected: LearningPath): void {
    expect(learningPath.hruid).toEqual(expected.hruid);
    expect(learningPath.language).toEqual(expected.language);
    expect(learningPath.description).toEqual(expected.description);
    expect(learningPath.title).toEqual(expected.title);

    expect(new Set(learningPath.keywords.split(' '))).toEqual(new Set(learningPath.keywords.split(' ')));

    expect(new Set(learningPath.target_ages)).toEqual(new Set(expected.target_ages));
    expect(learningPath.min_age).toEqual(Math.min(...expected.target_ages));
    expect(learningPath.max_age).toEqual(Math.max(...expected.target_ages));

    expect(learningPath.num_nodes).toEqual(expected.nodes.length);
    expect(learningPath.image ?? null).toEqual(expected.image ?? null);

    for (const node of expected.nodes) {
        const correspondingNode = learningPath.nodes.find(
            (it) => node.learningobject_hruid === it.learningobject_hruid && node.language === it.language && node.version === it.version
        );
        expect(correspondingNode).toBeTruthy();
        expect(Boolean(correspondingNode!.start_node)).toEqual(Boolean(node.start_node));

        for (const transition of node.transitions) {
            const correspondingTransition = correspondingNode!.transitions.find(
                (it) =>
                    it.next.hruid === transition.next.hruid &&
                    it.next.language === transition.next.language &&
                    it.next.version === transition.next.version
            );
            expect(correspondingTransition).toBeTruthy();
        }
    }
}

/**
 * Expect that the given result is a singleton list with exactly the given element.
 */
export function expectToHaveFoundPrecisely<T extends object>(expected: T, result: T[]): void {
    expect(result).toHaveProperty('length');
    expect(result.length).toBe(1);
    expectToBeCorrectEntity(result[0], expected);
}

/**
 * Expect that the given result is an empty list.
 */
export function expectToHaveFoundNothing<T>(result: T[]): void {
    expect(result).toHaveProperty('length');
    expect(result.length).toBe(0);
}
