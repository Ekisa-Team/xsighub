import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { XsighubAppConfigSchema, XsighubSecurityConfigSchema } from './schemas';

export interface XsighubMergedApiConfig {
    app: XsighubAppConfigSchema;
    security: XsighubSecurityConfigSchema;
}

export const XSIGHUB_CONFIG_SERVICE = Symbol('xsighub-api-config-service');

@Injectable()
export class XsighubConfigService {
    constructor(private readonly _configService: ConfigService) {}

    get app(): XsighubAppConfigSchema {
        return this._configService.get<XsighubAppConfigSchema>('app');
    }

    get security(): XsighubSecurityConfigSchema {
        return this._configService.get<XsighubSecurityConfigSchema>('security');
    }

    getMergedConfig = (): XsighubMergedApiConfig => ({
        app: this.app,
        security: this.security,
    });
}
