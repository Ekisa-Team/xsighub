import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

/**
 * Decorador que extrae el User-Agent del objeto de solicitud.
 * @param ctx - El contexto de ejecución de la solicitud actual.
 * @returns User-Agent del cliente.
 */
export const UserAgent = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const userAgent = request.headers?.['user-agent'];

    const parser = new UAParser(userAgent);

    return parser.getResult();
});
