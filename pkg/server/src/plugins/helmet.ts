import type { FastifyHelmetOptions } from '@fastify/helmet';
import helmet from '@fastify/helmet';
import fp from 'fastify-plugin';

/**
 * @fastify/cors habilita el uso de helmet en la aplicación
 *
 * @see https://github.com/fastify/fastify-helmet
 */
export const helmetPlugin = fp<FastifyHelmetOptions>(async (fastify, opts) => {
    void fastify.register(helmet, {
        ...opts,
    });
});
