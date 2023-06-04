import { XsighubException } from '@lib/exceptions';
import { HttpStatus } from '@nestjs/common';
import { SessionDocumentErrorCodes } from '../error-codes/session-document.error-codes';

class SessionDocumentNotFoundById extends XsighubException {
    constructor(args: { documentId: number }) {
        const message = `El documento asociado con el ID ${args.documentId} no pudo ser encontrado.`;

        super({
            errorCode: SessionDocumentErrorCodes.SessionDocumentNotFoundById,
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }
}

class SessionDocumentSignatureNotFoundByName extends XsighubException {
    constructor(args: { signatureName: string }) {
        const message = `La firma asociada con el nombre ${args.signatureName} no pudo ser encontrada.`;

        super({
            errorCode: SessionDocumentErrorCodes.SessionDocumentSignatureNotFoundByName,
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }
}

export const sessionDocumentExceptions = {
    [SessionDocumentErrorCodes.SessionDocumentNotFoundById]: SessionDocumentNotFoundById,
    [SessionDocumentErrorCodes.SessionDocumentSignatureNotFoundByName]:
        SessionDocumentSignatureNotFoundByName,
};
