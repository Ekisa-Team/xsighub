import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { UserAgent } from './user-agent.decorator';

describe('UserAgent', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types, @typescript-eslint/explicit-function-return-type
    function getParamDecoratorFactory(decorator: Function) {
        class TestDecorator {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
            public test(@UserAgent() userAgent: UAParser.IResult): void {}
        }

        const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');

        return args[Object.keys(args)[0]].factory;
    }

    it('should extract User-Agent from request headers (Linux)', () => {
        const mockUserAgent =
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0';

        const mockRequest = {
            headers: {
                'user-agent': mockUserAgent,
            },
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(UserAgent);

        const result = factory(null, mockContext);

        expect(result).toMatchObject({
            ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0',
            browser: { name: 'Firefox', version: '87.0', major: '87' },
            engine: { name: 'Gecko', version: '87.0' },
            os: { name: 'Ubuntu', version: undefined },
            device: { vendor: undefined, model: undefined, type: undefined },
            cpu: { architecture: 'amd64' },
        });
    });

    it('should extract User-Agent from request headers (Windows)', () => {
        const mockUserAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';

        const mockRequest = {
            headers: {
                'user-agent': mockUserAgent,
            },
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(UserAgent);

        const result = factory(null, mockContext);

        expect(result).toMatchObject({
            ua: mockUserAgent,
            browser: { name: 'Chrome', version: '89.0.4389.82', major: '89' },
            engine: { name: 'Blink', version: '89.0.4389.82' },
            os: { name: 'Windows', version: '10' },
            device: { vendor: undefined, model: undefined, type: undefined },
            cpu: { architecture: 'amd64' },
        });
    });

    it('should extract User-Agent from request headers (Android)', () => {
        const mockUserAgent =
            'Mozilla/5.0 (Linux; Android 11; Pixel 4a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Mobile Safari/537.36';

        const mockRequest = {
            headers: {
                'user-agent': mockUserAgent,
            },
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(UserAgent);

        const result = factory(null, mockContext);

        expect(result).toMatchObject({
            ua: 'Mozilla/5.0 (Linux; Android 11; Pixel 4a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Mobile Safari/537.36',
            browser: { name: 'Chrome', version: '89.0.4389.82', major: '89' },
            engine: { name: 'Blink', version: '89.0.4389.82' },
            os: { name: 'Android', version: '11' },
            device: { vendor: 'Google', model: 'Pixel 4a', type: 'mobile' },
            cpu: { architecture: undefined },
        });
    });

    it('should extract User-Agent from request headers (iPhone)', () => {
        const mockUserAgent =
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';

        const mockRequest = {
            headers: {
                'user-agent': mockUserAgent,
            },
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(UserAgent);

        const result = factory(null, mockContext);

        expect(result).toMatchObject({
            ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            browser: { name: 'Mobile Safari', version: '14.0.3', major: '14' },
            engine: { name: 'WebKit', version: '605.1.15' },
            os: { name: 'iOS', version: '14.4' },
            device: { vendor: 'Apple', model: 'iPhone', type: 'mobile' },
            cpu: { architecture: undefined },
        });
    });

    it('should return undefined entries if request headers do not contain User-Agent', () => {
        const mockRequest = {
            headers: {},
        };

        const mockContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as unknown as ExecutionContext;

        const factory = getParamDecoratorFactory(UserAgent);

        const result = factory(null, mockContext);

        expect(result).toMatchObject({
            ua: '',
            browser: { name: undefined, version: undefined, major: undefined },
            engine: { name: undefined, version: undefined },
            os: { name: undefined, version: undefined },
            device: { vendor: undefined, model: undefined, type: undefined },
            cpu: { architecture: undefined },
        });
    });
});
