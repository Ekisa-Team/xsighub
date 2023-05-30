import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { XSIGHUB_THROTTLER_MODULE_CONFIG } from './modules/xsighub-throttler.module-config';

export interface XsighubApiBundleModulesConfig {
    throttlerModule: () => ThrottlerAsyncOptions;
}

export const DEFAULT_XSIGHUB_API_BUNDLE_MODULES_CONFIG: XsighubApiBundleModulesConfig = {
    throttlerModule: XSIGHUB_THROTTLER_MODULE_CONFIG,
};
