import { HttpException, HttpStatus } from '@nestjs/common';

export type XsighubExceptionArgs = {
    errorCode: string;
    message: string;
    status: HttpStatus;
};

export class XsighubException extends HttpException {
    errorCode: string;

    constructor(public readonly payload: XsighubExceptionArgs) {
        super(`${payload.message}`, payload.status);

        this['xsighubErrorCode'] = payload.errorCode;
    }
}
