import * as Joi from 'joi';

export function validateSchema<SchemaType>(schema: Joi.AnySchema<SchemaType>, config: SchemaType): SchemaType {
    const { error, value } = schema.validate(config, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((detail) => `"${detail.context?.key}" ${detail.message}`).join(', ');

        throw new Error(`Config validation error: ${errorMessage}`);
    }

    return value;
}
