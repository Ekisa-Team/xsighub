import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { XsighubConfigService } from './config.service';
import { xsighubAppConfigSchema, xsighubSecurityConfigSchema } from './schemas';

const envFilePath = join(
    process.cwd(),
    'envs',
    process.env['ENV_FILE_PATH'] || `${process.env['NODE_ENV'] || 'development'}.env`,
);

export const ENV_FILE_PATH = Symbol('env-file-path');

@Module({})
export class XsighubConfigModule {
    static forRoot(): DynamicModule {
        return {
            global: true,
            module: XsighubConfigModule,
            imports: [
                ConfigModule.forRoot({
                    load: [xsighubAppConfigSchema, xsighubSecurityConfigSchema],
                    envFilePath,
                }),
            ],
            providers: [
                XsighubConfigService,
                {
                    provide: ENV_FILE_PATH,
                    useValue: envFilePath,
                },
            ],
            exports: [ConfigModule, XsighubConfigService],
        };
    }
}
