import {BadRequestException} from "../exceptions/bad-request-exception";

/**
 * Checks for the presence of required fields and throws a BadRequestException
 * if any are missing.
 *
 * @param fields - An object with key-value pairs to validate.
 */
export function requireFields(fields: Record<string, unknown>): void {
    const missing = Object.entries(fields)
        .filter(([_, value]) => value === undefined || value === null || value === '')
        .map(([key]) => key);

    if (missing.length > 0) {
        const message = `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`;
        throw new BadRequestException(message);
    }
}
