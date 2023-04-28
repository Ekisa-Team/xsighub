import { PinoLoggerOptions } from 'fastify/types/logger';
import fs from 'fs';

// Create dir for logs
const logsDir = './logs';

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Set logger options
const logger = import.meta.env.DEV
    ? ({
          transport: {
              target: 'pino-pretty',
              options: {
                  translateTime: 'HH:MM:ss.l',
                  ignore: 'pid,hostname',
              },
          },
      } as PinoLoggerOptions)
    : ({
          pinoHttp: {
              level: 'warn',
              file: logsDir + '/warn-logs.log',
          },
      } as PinoLoggerOptions);

export { logger };
