import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly _logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const req: Request = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.url;

        this._logger.log(`[${method}] ${url}`);

        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const responseTime = Date.now() - now;
                this._logger.log(`[${method}] ${url} -> ${responseTime}ms`);
            }),
        );
    }
}
