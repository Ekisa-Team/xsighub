import { DEFAULT_XSIGHUB_API_BUNDLE_MODULES_CONFIG, XsighubConfigModule } from '@lib/config';
import { XsighubLoggerModule } from '@lib/logger';
import { CorrelationIdMiddleware } from '@lib/middlewares';
import { PrismaModule } from '@lib/prisma';
import { SessionModule } from '@modules/session';
import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({})
export class AppModule implements NestModule {
    static forRootAsync(): DynamicModule {
        const modulesConfig = { ...DEFAULT_XSIGHUB_API_BUNDLE_MODULES_CONFIG };

        const NEST_MODULES = [ThrottlerModule.forRootAsync(modulesConfig.throttlerModule())];

        const APP_MODULES = [XsighubLoggerModule.forRoot(), XsighubConfigModule.forRoot(), PrismaModule, SessionModule];

        return {
            module: AppModule,
            imports: [...NEST_MODULES, ...APP_MODULES],
        };
    }

    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(CorrelationIdMiddleware).forRoutes('*');
    }
}
