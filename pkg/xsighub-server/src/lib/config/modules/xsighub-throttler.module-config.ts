import { ThrottlerAsyncOptions, ThrottlerModuleOptions } from '@nestjs/throttler';
import { XsighubLoggerService } from '../../logger';
import { XsighubConfigService } from '../config.service';

export const XSIGHUB_THROTTLER_MODULE_CONFIG: () => ThrottlerAsyncOptions = () => ({
    useFactory: async (
        config: XsighubConfigService,
        logger: XsighubLoggerService,
    ): Promise<ThrottlerModuleOptions> => {
        const { enabled, ttl, limit } = config.security.rateLimit;

        if (enabled) {
            logger.info(`Rate-Limit is enabled -> [ttl: ${ttl}] [limit: ${limit}]`);

            return { ttl, limit };
        }

        return {};
    },
    inject: [XsighubConfigService, XsighubLoggerService],
});
