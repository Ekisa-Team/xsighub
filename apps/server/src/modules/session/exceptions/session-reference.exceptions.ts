import { XsighubException } from '@lib/exceptions';
import { HttpStatus } from '@nestjs/common';
import { SessionReferenceErrorCodes } from '../error-codes/session-reference.error-codes';

class SessionReferenceNotFoundById extends XsighubException {
    constructor(args: { referenceId: number }) {
        const message = `La referencia asociada con el ID ${args.referenceId} no pudo ser encontrada.`;

        super({
            errorCode: SessionReferenceErrorCodes.SessionReferenceNotFoundById,
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }
}

class SessionReferenceUniqueStandalone extends XsighubException {
    constructor() {
        const message = `Solo puede haber una única referencia independiente por sesión.`;

        super({
            errorCode: SessionReferenceErrorCodes.SessionReferenceUniqueStandalone,
            message,
            status: HttpStatus.BAD_REQUEST,
        });
    }
}

export const sessionReferenceExceptions = {
    [SessionReferenceErrorCodes.SessionReferenceNotFoundById]: SessionReferenceNotFoundById,
    [SessionReferenceErrorCodes.SessionReferenceUniqueStandalone]: SessionReferenceUniqueStandalone,
};
