import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let responseMessage = (exception as Error).message;
        let stack = (exception as Error).stack;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
            responseMessage = (exception.getResponse() as any)['message'];
            stack = exception.stack;
        }

        const exceptionResponse = {
            statusCode: status,
            timestamp: new Date(),
            path: request.url,
            message,
            responseMessage,
            stack,
            innerException: exception,
        };

        response.status(status).json(exceptionResponse);
    }
}
