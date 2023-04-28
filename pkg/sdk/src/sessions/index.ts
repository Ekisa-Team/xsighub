type SessionEvents = {
    onConnectEstablished: (data: unknown) => void;
    onDataReceived: (data: unknown) => void;
    onDestroy: () => void;
    onError: (error: unknown) => void;
};

function create(data?: Partial<SessionEvents>): void {
    console.log('createSession', data);
}

function destroy(): void {
    console.log('init');
}

function retrieveSignatures(): void {
    console.log('retrieveSignatures');
}

export const sessions = {
    create,
    destroy,
    retrieveSignatures,
};
