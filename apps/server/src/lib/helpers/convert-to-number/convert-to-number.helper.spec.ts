import { convertToNumber } from './convert-to-number.helper';

describe('convertToNumber', () => {
    it('should return undefined for undefined input', () => {
        expect(convertToNumber(undefined)).toBeUndefined();
    });

    it('should return undefined for non-numeric input', () => {
        expect(convertToNumber('abc')).toBeUndefined();
    });

    it('should return a number for numeric input', () => {
        expect(convertToNumber('123')).toBe(123);
    });
});
