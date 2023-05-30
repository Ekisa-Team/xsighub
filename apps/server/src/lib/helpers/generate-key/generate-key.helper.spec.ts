import { describe, expect, it } from 'vitest';
import { generateKey } from './generate-key.helper';

describe('generateKey', () => {
    it('generates a key of the correct length', () => {
        const length = 6;
        const key = generateKey(length);

        expect(key).toMatch(/^[0-9]+$/);
        expect(key.toString()).toHaveLength(length);
    });

    it('generates a different key each time', () => {
        const length = 6;
        const key1 = generateKey(length);
        const key2 = generateKey(length);

        expect(key1).not.toEqual(key2);
    });
});
