import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { randomUUID } from 'crypto';
import { XsighubHttpHeaders } from '../../http-headers';
import { CorrelationId } from './correlation-id.decorator';

describe('CorrelationId', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types, @typescript-eslint/explicit-function-return-type
    function getParamDecoratorFactory(decorator: Function) {
        class TestDecorator {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
            public test(@CorrelationId() correlationId: string): void {}
        }

        const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');

        return args[Object.keys(args)[0]].factory;
    }

    it('should return the correlation ID if it exists in the request', () => {
        const uuid = randomUUID();

        const mockRequest = {
            headers: {
                [XsighubHttpHeaders.HTTP_HEADER_CORRELATION_ID]: uuid,
            },
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(CorrelationId);

        const result = factory(null, mockContext);

        expect(result).toBe(uuid);
    });

    it('should return undefined if the correlation ID cannot be obtained from the request', () => {
        const mockRequest = {
            headers: {},
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(CorrelationId);

        const result = factory(null, mockContext);

        expect(result).toBeUndefined();
    });
});
