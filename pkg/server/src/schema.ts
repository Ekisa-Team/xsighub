import { EnvSchemaData } from 'env-schema';

export type SchemaData = {
    PORT: number;
    SECRET: string;
};

export const schema: EnvSchemaData = {
    type: 'object',
    required: ['PORT', 'SECRET'],
    properties: {
        PORT: {
            type: 'number',
            default: 3000,
        },
        SECRET: {
            type: 'string',
        },
    },
};
