import { describe, expect, it } from 'vitest';
import { app } from '../test/fastify';

describe('root', () => {
    it('serve GET /', async () => {
        const res = await app.inject('/');
        expect(res.json()).toEqual({ status: true });
    });

    it('serve GET /health', async () => {
        const res = await app.inject('/health');
        expect(res.json()).toEqual({ status: true });
    });

    it('serve GET /secrets', async () => {
        const res = await app.inject('/secrets');
        expect(res.json()).toEqual({ status: true });
    });
});
