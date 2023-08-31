import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { XsighubLogMethod } from './interfaces/log-method.interface';

@Injectable({
    scope: Scope.TRANSIENT,
})
export class XsighubLoggerService extends PinoLogger {
    override info: XsighubLogMethod = (message: string, obj?: unknown, ...args: unknown[]): void =>
        super.info(obj ?? {}, message, args);

    override error: XsighubLogMethod = (message: string, obj?: unknown, ...args: unknown[]) =>
        super.error(obj ?? {}, message, args);

    override warn: XsighubLogMethod = (message: string, obj?: unknown, ...args: unknown[]) =>
        super.warn(obj ?? {}, message, args);

    override trace: XsighubLogMethod = (message: string, obj?: unknown, ...args: unknown[]) =>
        super.trace(obj ?? {}, message, args);
}
