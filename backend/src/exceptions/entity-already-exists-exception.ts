import {ConflictException} from "./conflict-exception";

export class EntityAlreadyExistsException extends ConflictException {
    constructor(message: string) {
        super(message);
    }
}
