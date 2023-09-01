export type SocketEvent<EventName extends string> = {
    [key in EventName]: string;
};

export const __serverEvents__: SocketEvent<
    | 'sessionCreated'
    | 'sessionUpdated'
    | 'sessionPaired'
    | 'sessionUnpaired'
    | 'sessionDestroyed'
    | 'referenceOpenedRequested'
> = {
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
    referenceId: number;
};

type OpenReferenceDocumentRequest = {
    kind: 'document';
    referenceId: number;
    documentId: number;
};

export type OpenReferenceRequest = OpenReferenceStandaloneRequest | OpenReferenceDocumentRequest;
