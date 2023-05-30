import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { XsighubHttpHeaders } from '../../http-headers';

/**
 * Decorador que extrae el correlation ID del objeto de solicitud.
 * @param ctx - El contexto de ejecución de la solicitud actual.
 * @returns Correlation ID asociado a la petición HTTP.
 */
export const CorrelationId = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const correlationId = request.headers?.[XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID];

    return correlationId;
});
