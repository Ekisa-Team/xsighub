import envSchema from 'env-schema';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { SchemaData, schema } from '../schema';

export const root: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get('/', async () => ({
        status: true,
    }));

    fastify.get('/health', async () => ({
        status: true,
    }));

    fastify.post('/secrets', async (request, reply) => {
        const { secret } = request.body as FastifyRequest<{
            Body: { secret: string };
        }>['body'];

        const { SECRET } = envSchema<SchemaData>({
            dotenv: true,
            schema,
        });

        if (secret !== SECRET) {
            return reply.status(401).send({
                message: `A valid secret key must be provided.`,
            });
        }

        return reply.send({ status: true });
    });
};
