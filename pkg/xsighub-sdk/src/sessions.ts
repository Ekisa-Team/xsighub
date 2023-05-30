import { Session } from 'inspector';
import QRCode from 'qrcode';
import { SdkArtifacts } from './sdk-artifacts';

export interface SdkSessions {
    create: () => Promise<Response>;
    retrieve: (pairingKey: string) => Promise<Response>;
    pair: (pairingKey: string) => Promise<Response>;
    update: (pairingKey: string, session: Partial<Session>) => Promise<Response>;
    destroy: (pairingKey: string) => Promise<Response>;
    generateQR: (pairingKey: string) => Promise<string>;
}

export class Sessions implements SdkSessions {
    private api: string;

    constructor(private readonly artifacts: SdkArtifacts) {
        this.api = `${artifacts.api}/api/v1/sessions`;
    }

    async create(): Promise<Response> {
        return fetch(`${this.api}`, { method: 'POST' });
    }

    async retrieve(pairingKey: string): Promise<Response> {
        return fetch(`${this.api}/${pairingKey}`);
    }

    async pair(pairingKey: string): Promise<Response> {
        return fetch(`${this.api}/${pairingKey}/connections`, { method: 'PATCH' });
    }

    async update(pairingKey: string, session: Partial<Session>): Promise<Response> {
        return fetch(`${this.api}/${pairingKey}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session }),
        });
    }

    async destroy(pairingKey: string): Promise<Response> {
        return fetch(`${this.api}/${pairingKey}`, { method: 'DELETE' });
    }

    async generateQR(pairingKey: string): Promise<string> {
        return new Promise((resolve, reject) => {
            QRCode.toString(pairingKey, (error, value) => {
                if (error) {
                    reject(error);
                }

                resolve(value);
            });
        });
    }
}
