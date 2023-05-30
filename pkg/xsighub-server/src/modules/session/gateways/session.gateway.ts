import { XsighubLoggerService } from '@lib/logger';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any) {
        console.log(`Received message from ${client.id}: ${payload}`);
        this._server.emit('message', `Echo: ${payload}`);
    }
}
