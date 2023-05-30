import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { convertToBoolean, convertToNumber } from '../../helpers';
import { validateSchema } from '../config.validator';

export interface XsighubSecurityConfigSchema {
    helmet: {
        enabled: boolean;
    };
    cors: {
        enabled: boolean;
        allowedOrigin?: string;
        allowedMethods?: string;
        allowedHeaders?: string;
    };
    rateLimit: {
        enabled: boolean;
        ttl: number;
        limit: number;
    };
}

export const xsighubSecurityConfigSchema = registerAs(
    'security',
    (): XsighubSecurityConfigSchema => {
        const schema = Joi.object<XsighubSecurityConfigSchema, true>({
            helmet: Joi.object({
                enabled: Joi.boolean().default(true),
            }),
            cors: Joi.object({
                enabled: Joi.boolean().default(true),
                allowedOrigin: Joi.string().default('*'),
                allowedMethods: Joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'),
                allowedHeaders: Joi.string().default('Content-Type, Accept'),
            }),
            rateLimit: Joi.object({
                enabled: Joi.boolean().default(false),
                ttl: Joi.number().default(60),
                limit: Joi.number().default(100),
            }),
        });

        const config: XsighubSecurityConfigSchema = {
            helmet: {
                enabled: convertToBoolean(process.env['SECURITY_HELMET_ENABLED']),
            },
            cors: {
                enabled: convertToBoolean(process.env['SECURITY_CORS_ENABLED']),
                allowedOrigin: process.env['SECURITY_CORS_ALLOWED_ORIGIN'],
                allowedMethods: process.env['SECURITY_CORS_ALLOWED_METHODS'],
                allowedHeaders: process.env['SECURITY_CORS_ALLOWED_HEADERS'],
            },
            rateLimit: {
                enabled: convertToBoolean(process.env['SECURITY_THROTTLE_ENABLED']),
                ttl: convertToNumber(process.env['SECURITY_THROTTLE_TTL']),
                limit: convertToNumber(process.env['SECURITY_THROTTLE_LIMIT']),
            },
        };

        return validateSchema(schema, config);
    },
);
