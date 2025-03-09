import {AssertionError} from "node:assert";

// Ignored properties because they belang for example to the class, not to the entity itself.
const IGNORE_PROPERTIES = ["parent"];

/**
 * Checks if the actual entity from the database conforms to the entity that was added previously.
 * @param actual The actual entity retrieved from the database
 * @param expected The (previously added) entity we would expect to retrieve
 */
export function expectToBeCorrectEntity<T extends object>(
    actual: {entity: T, name?: string},
    expected: {entity: T, name?: string}
): void {
    if (!actual.name) {
        actual.name = "actual";
    }
    if (!expected.name) {
        expected.name = "expected";
    }
    for (let property in expected.entity) {
        if (
            property !in IGNORE_PROPERTIES
            && expected.entity[property] !== undefined // If we don't expect a certain value for a property, we assume it can be filled in by the database however it wants.
            && typeof expected.entity[property] !== "function" // Functions obviously are not persisted via the database
        ) {
            if (!actual.entity.hasOwnProperty(property)) {
                throw new AssertionError({
                    message: `${expected.name} has defined property ${property}, but ${actual.name} is missing it.`
                });
            }
            if (typeof expected.entity[property] === "boolean") { // Sometimes, booleans get represented by numbers 0 and 1 in the objects actual from the database.
                if (!!expected.entity[property] !== !!actual.entity[property]) {
                    throw new AssertionError({
                        message: `${property} was ${expected.entity[property]} in ${expected.name},
                        but ${actual.entity[property]} (${!!expected.entity[property]}) in ${actual.name}`
                    });
                }
            } else if (typeof expected.entity[property] !== typeof actual.entity[property]) {
                throw new AssertionError({
                    message: `${property} has type ${typeof expected.entity[property]} in ${expected.name}, but type ${typeof actual.entity[property]} in ${actual.name}.`
                });
            } else if (typeof expected.entity[property] === "object") {
                expectToBeCorrectEntity(
                    {
                        name: actual.name + "." + property,
                        entity: actual.entity[property] as object
                    }, {
                        name: expected.name + "." + property,
                        entity: expected.entity[property] as object
                    }
                );
            } else {
                if (expected.entity[property] !== actual.entity[property]) {
                    throw new AssertionError({
                        message: `${property} was ${expected.entity[property]} in ${expected.name}, but ${actual.entity[property]} in ${actual.name}`
                    });
                }
            }
        }
    }
}
