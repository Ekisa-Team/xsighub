import { XsighubLoggerService } from '@lib/logger';
import { ApiExtras } from '@lib/types/api-extras';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

    async handleSessionCreated(session: SessionDto, { correlationId }: ApiExtras) {
        this._logger.info(`[${this.handleSessionCreated.name}]`, { correlationId });

        this._server.emit('sessionCreated', {
            message: `Session created: ${session.id}`,
            session,
        });
    }

    async handleSessionUpdated(session: SessionDto, { correlationId }: ApiExtras) {
        this._logger.info(`[${this.handleSessionUpdated.name}]`, { correlationId });

        this._server.emit('sessionUpdated', {
            message: `Session updated: ${session.id}`,
            session,
        });
    }

    async handleSessionPaired(session: SessionDto, { correlationId }: ApiExtras) {
        this._logger.info(`[${this.handleSessionPaired.name}]`, { correlationId });

        this._server.emit('sessionPaired', {
            message: `Session paired: ${session.id}`,
            session,
        });
    }

    async handleSessionDestroyed(session: SessionDto, { correlationId }: ApiExtras) {
        this._logger.info(`[${this.handleSessionDestroyed.name}]`, { correlationId });

        this._server.emit('sessionDestroyed', {
            message: `Session destroyed: ${session.id}`,
            session,
        });
    }
}
