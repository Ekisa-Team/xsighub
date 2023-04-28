import { afterAll, beforeAll } from 'vitest';
import { FastifyFactory } from '../app';

const app = FastifyFactory.create();

beforeAll(async () => {
    // called once before all tests run
    await app.ready();
});

afterAll(async () => {
    // called once after all tests run
    await app.close();
});

export { app };
