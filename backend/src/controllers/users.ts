export const MISSING_USERNAME_ERROR = { error: 'Missing required field: username' };

export function NAME_NOT_FOUND_ERROR(username: string){
    return {error: `User with username '${username}' not found.`};
}

export const MISSING_FIELDS_ERROR = { error: 'Missing required fields: username, firstName, lastName'}
