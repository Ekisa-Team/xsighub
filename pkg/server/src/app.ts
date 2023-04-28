import { fastify as Fastify, FastifyServerOptions } from 'fastify';
import { corsPlugin } from './plugins/cors';
import { helmetPlugin } from './plugins/helmet';
import { root } from './routes/root';
import { sessions } from './routes/sessions';

const create = (opts?: FastifyServerOptions) => {
    const fastify = Fastify(opts);

    // plugins
    fastify.register(corsPlugin);
    fastify.register(helmetPlugin);

    // routes
    fastify.register(root);
    fastify.register(sessions, { prefix: 'api/v1' });

    return fastify;
};

export const FastifyFactory = { create };
