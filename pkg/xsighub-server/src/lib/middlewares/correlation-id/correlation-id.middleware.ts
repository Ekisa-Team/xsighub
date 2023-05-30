import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { XsighubHttpHeaders } from '../../http-headers';

/**
 * Middleware que genera un ID de correlación único para cada solicitud
 * y lo agrega a los encabezados tanto de la solicitud como de la respuesta.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    /**
     * Genera un nuevo ID de correlación y lo agrega a los encabezados de la solicitud entrante y la respuesta saliente.
     *
     * @param req El objeto de solicitud entrante.
     * @param res El objeto de respuesta saliente.
     * @param next La siguiente función de middleware en la cadena.
     */
    use(req: Request, res: Response, next: NextFunction): void {
        const uuid = randomUUID();

        req.headers && (req.headers[XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID] = uuid);

        res.set(XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID, uuid);

        next();
    }
}
