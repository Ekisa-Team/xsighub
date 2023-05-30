import { ExecutionContext } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
    let interceptor: LoggingInterceptor;
    let mockExecutionContext: ExecutionContext;

    beforeEach(() => {
        interceptor = new LoggingInterceptor();
        mockExecutionContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue({
                method: 'GET',
                url: '/test',
            }),
        } as unknown as ExecutionContext;
    });

    describe('intercept', () => {
        it('should log the request', (done) => {
            const mockCallHandler = {
                handle: (): Observable<string> => of('test'),
            };
            const loggerSpy = jest.spyOn(interceptor['_logger'], 'log');

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
                expect(loggerSpy).toHaveBeenCalledWith('[GET] /test');
                done();
            });
        });

        it('should log the response time', (done) => {
            const mockCallHandler = {
                handle: (): Observable<string> => of('test'),
            };
            const loggerSpy = jest.spyOn(interceptor['_logger'], 'log');

            interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
                expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('ms'));
                done();
            });
        });
    });
});
