/**
 * Converts a string to a boolean value if possible.
 *
 * @param value The string value to be converted to a boolean.
 * @returns The boolean value if the string can be converted, otherwise returns undefined.
 */
export const convertToBoolean = (value: string | undefined): boolean | undefined => {
    return { true: true, false: false, undefined: undefined }[value?.trim().toLowerCase() || 'undefined'];
};
