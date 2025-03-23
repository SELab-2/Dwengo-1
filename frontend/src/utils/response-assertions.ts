import {InvalidResponseException, NotFoundException} from "@/services/api-client/api-exceptions.ts";

export function single<T>(list: T[]): T {
    if (list.length === 1) {
        return list[0];
    } else if (list.length === 0) {
        throw new NotFoundException("Expected list with exactly one element, but got an empty list.");
    } else {
        throw new InvalidResponseException(`Expected list with exactly one element, but got one with ${list.length} elements.`);
    }
}
