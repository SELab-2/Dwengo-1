import { ConflictException } from './conflict-exception.js';

export class EntityAlreadyExistsException extends ConflictException {
    constructor(message: string) {
        super(message);
    }
}
