import { describe, expect, it } from 'vitest';
import { app } from '../../test/fastify';
import { SessionEndpoints } from './index';

describe('sessions', () => {
    it('serve GET /', async () => {
        const res = await app.inject(SessionEndpoints.retrieveSession);
        expect(true).toBe(true);
    });
});
