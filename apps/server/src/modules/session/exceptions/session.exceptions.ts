import { XsighubException } from '@lib/exceptions';
import { HttpStatus } from '@nestjs/common';
import { SessionErrorCodes } from '../error-codes/session.error-codes';

class SessionNotFoundById extends XsighubException {
    constructor(args: { sessionId: number }) {
        const message = `La sesión asociada con el ID ${args.sessionId} no pudo ser encontrada.`;

        super({
            errorCode: SessionErrorCodes.SessionNotFoundById,
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }
}

class SessionNotFoundByClientIp extends XsighubException {
    constructor(args: { clientIp: string }) {
        const message = `La sesión asociada con la dirección IP ${args.clientIp} no pudo ser encontrada.`;

        super({
            errorCode: SessionErrorCodes.SessionNotFoundByClientIp,
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }
}

class SessionNotFoundByPairingKey extends XsighubException {
    constructor(args: { pairingKey: string }) {
        const message = `La sesión asociada con la clave de emparejamiento ${args.pairingKey} no pudo ser encontrada.`;

        super({
            errorCode: SessionErrorCodes.SessionNotFoundByPairingKey,
            message,
            status: HttpStatus.NOT_FOUND,
        });
    }
}

class SessionAlreadyCreatedByIp extends XsighubException {
    constructor(args: { clientIp: string }) {
        const message = `La dirección IP ${args.clientIp} tiene una sesión existente. Por favor, asegúrese de destruir cualquier sesión existente antes de intentar crear una nueva.`;

        super({
            errorCode: SessionErrorCodes.SessionAlreadyCreatedByIp,
            message,
            status: HttpStatus.BAD_REQUEST,
        });
    }
}

export const sessionExceptions = {
    [SessionErrorCodes.SessionNotFoundById]: SessionNotFoundById,
    [SessionErrorCodes.SessionNotFoundByClientIp]: SessionNotFoundByClientIp,
    [SessionErrorCodes.SessionNotFoundByPairingKey]: SessionNotFoundByPairingKey,
    [SessionErrorCodes.SessionAlreadyCreatedByIp]: SessionAlreadyCreatedByIp,
};
