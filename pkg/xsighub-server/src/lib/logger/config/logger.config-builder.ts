import { IncomingMessage } from 'http';
import { Params as JinenLoggerConfig } from 'nestjs-pino';
import { XsighubAppConfigSchema } from '../../config/schemas';
import { XsighubHttpHeaders } from '../../http-headers';

export const jinenLoggerConfigBuilder = (
    config: XsighubAppConfigSchema['logging'],
): JinenLoggerConfig => ({
    pinoHttp: {
        transport: config.enablePrettyLogs ? { target: 'pino-pretty' } : undefined,
        autoLogging: false,
        serializers: {
            req: (req: Express.Request) => (config.displayRequestLogs ? req : undefined),
            res: (res: Express.Response) => (config.displayResponseLogs ? res : undefined),
        },
        customProps: (req: IncomingMessage) => ({
            correlationId: req.headers[XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID],
        }),
    },
});
