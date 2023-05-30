import { convertToBoolean } from './convert-to-boolean.helper';

describe('convertToBoolean', () => {
    it('should return undefined for undefined input', () => {
        expect(convertToBoolean(undefined)).toBeUndefined();
    });

    it('should return true for "true" input', () => {
        expect(convertToBoolean('true')).toBe(true);
    });

    it('should return false for "false" input', () => {
        expect(convertToBoolean('false')).toBe(false);
    });

    it('should return undefined for non-boolean input', () => {
        expect(convertToBoolean('abc')).toBeUndefined();
    });

    it('should be case-insensitive', () => {
        expect(convertToBoolean('TRUE')).toBe(true);

        expect(convertToBoolean('FALSE')).toBe(false);
    });
});
