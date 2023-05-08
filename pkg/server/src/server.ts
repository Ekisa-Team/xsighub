import envSchema from 'env-schema';
import { FastifyFactory } from './app';
import { logger } from './logger';
import { SchemaData, schema } from './schema';

const app = FastifyFactory.create({
    logger,
});

if (import.meta.env.PROD) {
    try {
        const { PORT } = envSchema<SchemaData>({
            dotenv: true,
            schema,
        });

        app.listen({
            port: PORT,
            host: '0.0.0.0',
        });
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

export const viteNodeApp = app;
