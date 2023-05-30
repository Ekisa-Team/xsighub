/**
 * Converts a string to a number if possible.
 *
 * @param value The string value to be converted to a number.
 * @returns The number value if the string can be converted, otherwise returns undefined.
 */
export const convertToNumber = (value: string | undefined): number | undefined => {
    return (value && !isNaN(+value) && parseInt(value, 10)) || undefined;
};
