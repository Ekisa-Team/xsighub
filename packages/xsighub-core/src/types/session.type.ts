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
    documents?: SessionDocument[];
    sessionId: Session['id'];
};

export type SessionSignature = {
    id: number;
    signatureData: string;
    metadata?: string;
    referenceId: SessionReference['id'];
};

export type SessionSignatureMetadata = {
    ingest: Record<string, string>;
};

export type SessionDocument = {
    id: number;
    rawContent: string;
    metadata?: string;
    referenceId: SessionReference['id'];
};

export type SessionDocumentMetadata = {
    ingest: Record<string, string>;
};

export type SessionDocumentSignature = {
    signatureName: string;
    signatureData: string;
};
