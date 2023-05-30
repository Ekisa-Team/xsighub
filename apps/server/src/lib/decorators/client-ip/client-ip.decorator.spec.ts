import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ClientIp, DEFAULT_IP_ADDRESS } from './client-ip.decorator';

describe('ClientIp', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types, @typescript-eslint/explicit-function-return-type
    function getParamDecoratorFactory(decorator: Function) {
        class TestDecorator {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
            public test(@ClientIp() clientIp: string): void {}
        }

        const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');

        return args[Object.keys(args)[0]].factory;
    }

    it('should return the client IP address if it exists in the request', () => {
        const mockRequest = {
            headers: {
                'x-forwarded-for': '192.0.2.1',
            },
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(ClientIp);

        const result = factory(null, mockContext);

        expect(result).toBe('192.0.2.1');
    });

    it('should return the default IP address if the client IP cannot be obtained from the request', () => {
        const mockRequest = {};

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(ClientIp);

        const result = factory(null, mockContext);

        expect(result).toBe(DEFAULT_IP_ADDRESS);
    });
});
