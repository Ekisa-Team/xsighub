import { XsighubLoggerService } from '@lib/logger';
import { ApiExtras } from '@lib/types/api-extras';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SessionDocumentDto } from '../dtos/session-document.dto';
import { SessionReferenceDto } from '../dtos/session-reference.dto';
import { SessionSignatureDto } from '../dtos/session-signature.dto';
import { SessionDto } from '../dtos/session.dto';

const clients = new Map<string, { web?: Socket; mobile?: Socket }>([]);

@WebSocketGateway({
    namespace: 'sessions',
    cors: true,
})
export class SessionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly _logger: XsighubLoggerService) {}

    afterInit() {
        this._logger.info(`[Session] Initialized gateway.`);
    }

    handleConnection(client: Socket) {
        this._logger.info(`[Session] Client connected ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this._logger.info(`[Session] Client disconnected ${client.id}`);
    }

    async handleSessionUpdated(
        session: SessionDto,
        extras: ApiExtras,
        options: {
            source: 'session' | 'reference' | 'signature' | 'document';
            action: 'create' | 'update' | 'delete';
            data: SessionDto | SessionReferenceDto | SessionSignatureDto | SessionDocumentDto;
        },
    ) {
        this._logger.info(`[${this.handleSessionUpdated.name}]`, extras);

        const { web, mobile } = clients.get(session.id.toString());
        const data = {
            message: `Session updated: ${session.id}`,
            session,
            source: options.source,
            action: options.action,
            data: options.data,
        };

        if (web) {
            web.emit('sessionUpdated', data);
        }

        if (mobile) {
            mobile.emit('sessionUpdated', data);
        }
    }

    async handleSessionPaired(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionPaired.name}]`, extras);

        const { web, mobile } = clients.get(session.id.toString());
        const data = {
            message: `Session paired: ${session.id}`,
            session,
        };

        if (web) {
            web.emit('sessionPaired', data);
        }

        if (mobile) {
            mobile.emit('sessionPaired', data);
        }
    }

    async handleSessionUnpaired(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionUnpaired.name}]`, extras);

        const { web, mobile } = clients.get(session.id.toString());
        const data = {
            message: `Session unpaired: ${session.id}`,
            session,
        };

        if (web) {
            web.emit('sessionUnpaired', data);
        }

        if (mobile) {
            mobile.emit('sessionUnpaired', data);
        }
    }

    async handleSessionDestroyed(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionDestroyed.name}]`, extras);

        const { web, mobile } = clients.get(session.id.toString());
        const data = {
            message: `Session destroyed: ${session.id}`,
            session,
        };

        if (web) {
            web.emit('sessionDestroyed', data);
        }

        if (mobile) {
            mobile.emit('sessionDestroyed', data);
        }

        clients.delete(session.id.toString());
    }

    @SubscribeMessage('handshake')
    handleCustomData(
        @MessageBody() { sessionId, client }: { sessionId: number; client: 'web' | 'mobile' },
        @ConnectedSocket() socket: Socket,
    ): void {
        if (client === 'web') {
            clients.set(sessionId.toString(), {
                ...clients.get(sessionId.toString()),
                web: socket,
            });
        }

        if (client === 'mobile') {
            clients.set(sessionId.toString(), {
                ...clients.get(sessionId.toString()),
                mobile: socket,
            });
        }
    }

    @SubscribeMessage('openReference')
    handleOpenReference(@MessageBody() body: Record<string, unknown>): void {
        const { mobile } = clients.get(body.sessionId.toString());

        mobile?.emit('referenceOpenedRequested', {
            message: `Web client requested to open a reference on the mobile client`,
            body,
        });
    }
}
