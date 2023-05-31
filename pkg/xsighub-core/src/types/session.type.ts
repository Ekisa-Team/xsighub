import { SocketEvent } from '../socket.io/socket-event';

export type Session = {
    id: number;
    pairingKey: string;
    connection?: SessionConnection | null;
    references?: SessionReference[];
};

export type SessionConnection = {
    id: number;
    clientIp: string;
    userAgent: string;
    isPaired: boolean;
    pairedAt?: Date;
    sessionId: Session['id'];
};

export type SessionReference = {
    id: number;
    type: 'standalone' | 'document';
    name: string;
    documentPlaceholder?: string | null;
    signatures?: SessionSignature[];
    sessionId: Session['id'];
};

export type SessionSignature = {
    id: number;
    ingest: string;
    metadata?: string | null;
    referenceId: SessionReference['id'];
};

export const __sessionSocketEvents__: SocketEvent<'created' | 'updated' | 'paired' | 'destroyed'> =
    {
        created: 'sessionCreated',
        updated: 'sessionUpdated',
        paired: 'sessionPaired',
        destroyed: 'sessionDestroyed',
    };
