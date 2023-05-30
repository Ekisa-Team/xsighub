import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getClientIp, Request } from 'request-ip';

/**
 * Dirección IP predeterminada para casos en los que no se puede obtener la IP del cliente
 */
export const DEFAULT_IP_ADDRESS = '0.0.0.0';

/**
 * Decorador que extrae la dirección IP del cliente del objeto de solicitud.
 * @param ctx - El contexto de ejecución de la solicitud actual.
 * @returns La dirección IP del cliente.
 */
export const ClientIp = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const clientIp = getClientIp(request) ?? DEFAULT_IP_ADDRESS;

    return clientIp;
});
