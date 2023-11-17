import { XsighubLoggerService } from '@lib/logger';
import { ApiExtras } from '@lib/types/api-extras';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionDocumentDto } from '../dtos/session-document.dto';
import { SessionReferenceDto } from '../dtos/session-reference.dto';
import { SessionSignatureDto } from '../dtos/session-signature.dto';
import { SessionDto } from '../dtos/session.dto';

const clients = new Map<string, Socket>([]);

@WebSocketGateway({
    namespace: 'sessions',
    cors: true,
})
export class SessionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly _server: Server;

    constructor(private readonly _logger: XsighubLoggerService) {}

    afterInit() {
        this._logger.info(`[Session] Initialized gateway`);
    }

    handleConnection(client: Socket) {
        this._logger.info(`[Session] Client connected ${client.id}`);
        clients.set(client.id, client);
        client.emit('handshakeInstantiated', { clientId: client.id });
    }

    handleDisconnect(client: Socket) {
        this._logger.info(`[Session] Client disconnected ${client.id}`);
        clients.delete(client.id);
        client.emit('handshakeInterrupted');
    }

    async handleSessionCreated(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionCreated.name}]`, extras);

        const client = clients.get(extras.clientId);

        client.emit('sessionCreated', {
            message: `Session created: ${session.id}`,
            session,
        });
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

        const client = clients.get(extras.clientId);

        client.emit('sessionUpdated', {
            message: `Session updated: ${session.id}`,
            session,
            source: options.source,
            action: options.action,
            data: options.data,
        });
    }

    async handleSessionPaired(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionPaired.name}]`, extras);

        const client = clients.get(extras.clientId);

        client.emit('sessionPaired', {
            message: `Session paired: ${session.id}`,
            session,
        });
    }

    async handleSessionUnpaired(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionUnpaired.name}]`, extras);

        const client = clients.get(extras.clientId);

        client.emit('sessionUnpaired', {
            message: `Session unpaired: ${session.id}`,
            session,
        });
    }

    async handleSessionDestroyed(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionDestroyed.name}]`, extras);

        const client = clients.get(extras.clientId);

        client.emit('sessionDestroyed', {
            message: `Session destroyed: ${session.id}`,
            session,
        });
    }

    @SubscribeMessage('openReference')
    handleOpenReference(@MessageBody() body: unknown): void {
        this._server.emit('referenceOpenedRequested', {
            message: `Web client requested to open a reference on the mobile client`,
            body,
        });
    }
}
