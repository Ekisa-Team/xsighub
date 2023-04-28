import { EnvSchemaData } from 'env-schema';

export type SchemaData = {
    PORT: number;
};

export const schema: EnvSchemaData = {
    type: 'object',
    required: ['PORT'],
    properties: {
        PORT: {
            type: 'number',
            default: 3000,
        },
    },
};
