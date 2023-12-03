import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { XsighubConfigService } from '../config';
import { jinenLoggerConfigBuilder } from './config/logger.config-builder';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { XsighubLoggerService } from './logger.service';

@Module({})
export class XsighubLoggerModule {
    static forRoot(): DynamicModule {
        return {
            global: true,
            module: XsighubLoggerModule,
            imports: [
                LoggerModule.forRootAsync({
                    useFactory: async (config: XsighubConfigService) => jinenLoggerConfigBuilder(config.app.logging),
                    inject: [XsighubConfigService],
                }),
            ],
            providers: [
                XsighubLoggerService,
                {
                    provide: APP_INTERCEPTOR,
                    useClass: LoggingInterceptor,
                },
            ],
            exports: [XsighubLoggerService],
        };
    }
}
