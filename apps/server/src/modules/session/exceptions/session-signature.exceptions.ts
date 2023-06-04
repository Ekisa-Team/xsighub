import { XsighubException } from '@lib/exceptions';
import { HttpStatus } from '@nestjs/common';
import { SessionSignatureErrorCodes } from '../error-codes/session-signature.error-codes';

class SessionSignatureNotFoundById extends XsighubException {
    constructor(args: { signatureId: number }) {
        const message = `La firma asociada con el ID ${args.signatureId} no pudo ser encontrada.`;

        super({
            errorCode: SessionSignatureErrorCodes.SessionSignatureNotFoundById,
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }
}

export const sessionSignatureExceptions = {
    [SessionSignatureErrorCodes.SessionSignatureNotFoundById]: SessionSignatureNotFoundById,
};
