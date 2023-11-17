import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { XsighubHttpHeaders } from '../../http-headers';

/**
 * Decorador que extrae el socket client ID del objeto de solicitud.
 * @param ctx - El contexto de ejecución de la solicitud actual.
 * @returns Correlation ID asociado a la petición HTTP.
 */
export const ClientId = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const clientId = request.headers?.[XsighubHttpHeaders.HTTP_HEADER_CLIENT_ID];

    return clientId;
});
