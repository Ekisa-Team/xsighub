import { NextFunction, Request, Response } from 'express';
import { XsighubHttpHeaders } from '../../http-headers';
import { CorrelationIdMiddleware } from './correlation-id.middleware';

describe('CorrelationIdMiddleware', () => {
    let middleware: CorrelationIdMiddleware;
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        middleware = new CorrelationIdMiddleware();
        req = { headers: {} } as Request;
        res = { set: jest.fn() } as unknown as Response;
        next = jest.fn();
    });

    it('should be defined', () => {
        expect(middleware).toBeDefined();
    });

    it('should add a correlation ID header to the request and response', () => {
        middleware.use(req, res, next);

        expect(req.headers[XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID]).toBeDefined();
        expect(res.set).toHaveBeenCalledWith(
            XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID,
            req.headers[XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID],
        );
    });

    it('should generate a unique correlation ID for each request', () => {
        middleware.use(req, res, next);

        const firstUuid = req.headers[XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID];

        middleware.use(req, res, next);

        const secondUuid = req.headers[XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID];

        expect(firstUuid).not.toEqual(secondUuid);
    });

    it('should call the next middleware function', () => {
        middleware.use(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
