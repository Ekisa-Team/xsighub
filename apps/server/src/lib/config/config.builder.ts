import {
    INestApplication,
    Logger,
    NestApplicationOptions,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';
import { SwaggerTheme } from 'swagger-themes';
import { ExceptionsFilter } from '../filters';
import { ENV_FILE_PATH } from './config.module';
import { XsighubConfigService, XsighubMergedApiConfig } from './config.service';

export class XsighubApiConfigBuilder {
    static nestApplicationOptions: NestApplicationOptions = {
        bufferLogs: true,
    };

    private _config: XsighubMergedApiConfig;

    constructor(private readonly _app: INestApplication) {
        this._config = this._app.get(XsighubConfigService).getMergedConfig();
    }

    withPinoLogger(): XsighubApiConfigBuilder {
        this._app.useLogger(this._app.get(PinoLogger));

        return this;
    }

    withHelmet(): XsighubApiConfigBuilder {
        const { enabled } = this._config.security.helmet;

        if (enabled) {
            this._app.use(helmet());

            Logger.log('Helmet protection enabled');
        }

        return this;
    }

    withCors(): XsighubApiConfigBuilder {
        const { enabled, allowedOrigin, allowedMethods, allowedHeaders } =
            this._config.security.cors;

        if (enabled) {
            this._app.enableCors({
                origin: allowedOrigin,
                methods: allowedMethods,
                allowedHeaders,
            });

            Logger.log(
                `CORS enabled -> [origin: ${allowedOrigin}] [methods: ${allowedMethods}] [headers: ${allowedHeaders}]`,
            );
        }

        return this;
    }

    withGlobalPipes(): XsighubApiConfigBuilder {
        this._app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        Logger.log(`Global pipes enabled -> [${ValidationPipe.name}]`);

        return this;
    }

    withGlobalFilters(): XsighubApiConfigBuilder {
        this._app.useGlobalFilters(new ExceptionsFilter());

        Logger.log(`Global filters enabled -> [${ExceptionsFilter.name}]`);

        return this;
    }

    withGlobalApiPrefix(): XsighubApiConfigBuilder {
        const { globalPrefix } = this._config.app;

        if (globalPrefix) {
            this._app.setGlobalPrefix(globalPrefix);

            Logger.log(`Global prefix is set -> [${globalPrefix}]`);
        }

        return this;
    }

    withVersioning(): XsighubApiConfigBuilder {
        const { enabled, type, prefix, header, key } = this._config.app.versioning;

        if (enabled) {
            const enableVersioning = {
                [VersioningType[VersioningType.URI]]: () =>
                    this._app.enableVersioning({ type: VersioningType.URI, prefix }),
                [VersioningType[VersioningType.HEADER]]: () =>
                    this._app.enableVersioning({ type: VersioningType.HEADER, header }),
                [VersioningType[VersioningType.MEDIA_TYPE]]: () =>
                    this._app.enableVersioning({ type: VersioningType.MEDIA_TYPE, key }),
            }[type];

            enableVersioning();

            Logger.log(
                `API versioning is enabled -> [type: ${type}] [prefix: ${prefix}] [header: ${header}] [key: ${key}]`,
            );
        }

        return this;
    }

    withOpenApi(): XsighubApiConfigBuilder {
        const documentConfig = new DocumentBuilder()
            .setTitle('Xsighub API')
            .setDescription('API documentation for developers')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(this._app, documentConfig);

        const theme = new SwaggerTheme('v3');

        const options: SwaggerCustomOptions = {
            explorer: true,
            customCss: theme.getBuffer('dark'),
        };

        SwaggerModule.setup('docs', this._app, document, options);

        return this;
    }

    bootstrap(): Promise<void> {
        const envFilePath = this._app.get(ENV_FILE_PATH);

        const { port } = this._config.app;

        return this._app.listen(port, () => {
            Logger.log(
                `🚀 Application is running on: http://localhost:${port} - config: ${envFilePath}`,
            );
        });
    }
}
