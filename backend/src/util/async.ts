/**
 * Replace all occurrences of regex in str with the result of asyncFn called with the matching snippet and each of
 * the parts matched by a group in the regex as arguments.
 *
 * @param str The string where to replace the occurrences
 * @param regex
 * @param replacementFn
 */
export async function replaceAsync(str: string, regex: RegExp, replacementFn: (match: string, ...args: string[]) => Promise<string>) {
    const promises: Promise<string>[] = [];

    // First run through matches: add all Promises resulting from the replacement function
    str.replace(regex, (full, ...args) => {
        promises.push(replacementFn(full, ...args));
        return full;
    });

    // Wait for the replacements to get loaded. Reverse them so when popping them, we work in a FIFO manner.
    const replacements: string[] = await Promise.all(promises);

    // Second run through matches: Replace them by their previously computed replacements.
    return str.replace(regex, () => replacements.pop()!);
}
