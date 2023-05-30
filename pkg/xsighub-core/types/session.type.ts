export type Session = {
    pairingKey: string;
    connection: SessionConnection;
    documents?: SessionDocument[] | null;
    data?: SessionData | null;
};

export type SessionConnection = {
    clientIp: string;
    userAgent: string;
    isPaired: boolean;
    pairedAt?: Date;
};

export type SessionData = {
    payload: string | SessionDocument;
};

export type SessionDocument = {
    id: string;
    title: string;
    content: string;
    signatures?: Record<string, string>;
    metadata?: Record<string, string>;
};
