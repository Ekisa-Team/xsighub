import { VersioningType } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { convertToBoolean, convertToNumber } from '../../helpers';
import { validateSchema } from '../config.validator';

export interface XsighubAppConfigSchema {
    port: number;
    globalPrefix: string;
    versioning: {
        enabled: boolean;
        type: keyof typeof VersioningType;
        prefix: string;
        header: string;
        key: string;
    };
    logging: {
        enabled: boolean;
        enablePrettyLogs: boolean;
        displayRequestLogs: boolean;
        displayResponseLogs: boolean;
    };
    timeout: {
        enabled: boolean;
        value: number;
    };
    xsighub: {
        cleanupSessionInterval: string;
    };
}

export const xsighubAppConfigSchema = registerAs('app', (): XsighubAppConfigSchema => {
    const schema = Joi.object<XsighubAppConfigSchema, true>({
        port: Joi.number().port().default(3000),
        globalPrefix: Joi.string().default('api'),
        versioning: Joi.object({
            enabled: Joi.boolean().default(true),
            type: Joi.string()
                .valid(...Object.keys(VersioningType))
                .default(VersioningType[VersioningType.URI]),
            prefix: Joi.string().default('v'),
            header: Joi.string().default('X-Jinen-Api-Version'),
            key: Joi.string().default('v='),
        }),
        logging: Joi.object({
            enabled: Joi.boolean().default(false),
            enablePrettyLogs: Joi.boolean().default(false),
            displayRequestLogs: Joi.boolean().default(false),
            displayResponseLogs: Joi.boolean().default(false),
        }),
        timeout: Joi.object({
            enabled: Joi.boolean().default(false),
            value: Joi.number().default(6000),
        }),
        xsighub: Joi.object({
            cleanupSessionInterval: Joi.string().default('7d'),
        }),
    });

    const config: XsighubAppConfigSchema = {
        port: convertToNumber(process.env['PORT']) || convertToNumber(process.env['APP_PORT']),
        globalPrefix: process.env['APP_GLOBAL_PREFIX'],
        versioning: {
            enabled: convertToBoolean(process.env['APP_VERSIONING_ENABLED']),
            type: process.env['APP_VERSIONING_TYPE'] as keyof typeof VersioningType,
            prefix: process.env['APP_VERSIONING_PREFIX'],
            header: process.env['APP_VERSIONING_HEADER'],
            key: process.env['APP_VERSIONING_MEDIA_TYPE_KEY'],
        },
        logging: {
            enabled: convertToBoolean(process.env['APP_LOGGING_ENABLED']),
            enablePrettyLogs: convertToBoolean(process.env['APP_LOGGING_ENABLE_PRETTY_LOGS']),
            displayRequestLogs: convertToBoolean(process.env['APP_LOGGING_DISPLAY_REQUEST_LOGS']),
            displayResponseLogs: convertToBoolean(process.env['APP_LOGGING_DISPLAY_RESPONSE_LOGS']),
        },
        timeout: {
            enabled: convertToBoolean(process.env['APP_TIMEOUT_ENABLED']),
            value: convertToNumber(process.env['APP_TIMEOUT_VALUE']),
        },
        xsighub: {
            cleanupSessionInterval: process.env['XSIGHUB_CLEANUP_SESSION_INTERVAL'],
        },
    };

    return validateSchema(schema, config);
});
