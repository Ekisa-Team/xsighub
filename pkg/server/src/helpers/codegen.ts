/**
 * Generates a random numeric key of the specified length.
 * @param length The length of the key to generate.
 * @returns A numeric key with the specified length.
 */
export const generateKey = (length: number): number => {
    const keyString = new Array(length)
        .fill(6)
        .map(() => Math.floor(Math.random() * 10))
        .join('');

    return Number(keyString);
};
