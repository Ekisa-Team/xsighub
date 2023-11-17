export type SocketEvent<EventName extends string> = {
    [key in EventName]: string;
};

export const __serverEvents__: SocketEvent<
    | 'handshakeInstantiated'
    | 'handshakeInterrupted'
    | 'sessionCreated'
    | 'sessionUpdated'
    | 'sessionPaired'
    | 'sessionUnpaired'
    | 'sessionDestroyed'
    | 'referenceOpenedRequested'
> = {
    handshakeInstantiated: 'handshakeInstantiated',
    handshakeInterrupted: 'handshakeInterrupted',
    sessionCreated: 'sessionCreated',
    sessionUpdated: 'sessionUpdated',
    sessionPaired: 'sessionPaired',
    sessionUnpaired: 'sessionUnpaired',
    sessionDestroyed: 'sessionDestroyed',
    referenceOpenedRequested: 'referenceOpenedRequested',
};

export const __webEvents__: SocketEvent<'openReference'> = {
    openReference: 'openReference',
};

type OpenReferenceStandaloneRequest = {
    kind: 'standalone';
    sessionId: number;
    referenceId: number;
};

type OpenReferenceDocumentRequest = {
    kind: 'document';
    sessionId: number;
    referenceId: number;
    documentId: number;
};

export type OpenReferenceRequest = OpenReferenceStandaloneRequest | OpenReferenceDocumentRequest;
