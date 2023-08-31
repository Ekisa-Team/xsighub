/**
 * Generates a random numeric key of the specified length.
 * @param length The length of the key to generate.
 * @returns A numeric key with the specified length.
 */
export const generateKey = (length: number): string => {
    return new Array(length)
        .fill(null)
        .map(() => Math.floor(Math.random() * 10))
        .join('');
};
