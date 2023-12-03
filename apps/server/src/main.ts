import { XsighubApiConfigBuilder } from '@lib/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule.forRootAsync(), XsighubApiConfigBuilder.nestApplicationOptions);

    const builder = new XsighubApiConfigBuilder(app)
        .withPinoLogger()
        .withHelmet()
        .withCors()
        .withGlobalPipes()
        .withGlobalFilters()
        .withGlobalApiPrefix()
        .withVersioning()
        .withOpenApi();

    app.useWebSocketAdapter(new IoAdapter(app));

    await builder.bootstrap();
}

bootstrap();
