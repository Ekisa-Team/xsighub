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
    }

    handleDisconnect(client: Socket) {
        this._logger.info(`[Session] Client disconnected ${client.id}`);
    }

    async handleSessionCreated(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionCreated.name}]`, extras);

        this._server.emit('sessionCreated', {
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

        this._server.emit('sessionUpdated', {
            message: `Session updated: ${session.id}`,
            session,
            source: options.source,
            action: options.action,
            data: options.data,
        });
    }

    async handleSessionPaired(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionPaired.name}]`, extras);

        this._server.emit('sessionPaired', {
            message: `Session paired: ${session.id}`,
            session,
        });
    }

    async handleSessionUnpaired(session: SessionDto, extras: ApiExtras) {
        this._logger.info(`[${this.handleSessionUnpaired.name}]`, extras);

        this._server.emit('sessionUnpaired', {
            message: `Session unpaired: ${session.id}`,
            session,
        });
    }

    async handleSessionDestroyed(session: SessionDto, { correlationId }: ApiExtras) {
        this._logger.info(`[${this.handleSessionDestroyed.name}]`, { correlationId });

        this._server.emit('sessionDestroyed', {
            message: `Session destroyed: ${session.id}`,
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
