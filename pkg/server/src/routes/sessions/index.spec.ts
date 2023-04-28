import { describe, expect, it } from 'vitest';
import { app } from '~/src/test/fastify';

describe('sessions', () => {
    it('serve GET /', async () => {
        const res = await app.inject('/sessions');
        expect(res.json()).toEqual({ holi: true });
    });
});
