import { Session } from '@ekisa-xsighub/core';
import { handleResponse } from '../helpers';
import { SdkClientConfig } from '../types/sdk-config.type';

export interface SdkSessions {
    create(): Promise<Session>;
    findByIpAddress(): Promise<Session>;
    findByPairingKey(pairingKey: string): Promise<Session>;
    pair(pairingKey: string): Promise<Session>;
    unpair(pairingKey: string): Promise<Session>;
    destroy(pairingKey: string): Promise<Session>;
}

export class Sessions implements SdkSessions {
    api: string;

    constructor(private readonly config: SdkClientConfig) {
        this.api = `${this.config.api}/${this.config.version}/sessions`;
    }

    async create(): Promise<Session> {
        return fetch(`${this.api}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-xsighub-client-id': this.config.clientId,
            },
        }).then(handleResponse);
    }

    async findByIpAddress(): Promise<Session> {
        return fetch(`${this.api}`, {
            headers: {
                'x-xsighub-client-id': this.config.clientId,
            },
        }).then(handleResponse);
    }

    async findByPairingKey(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}`, {
            headers: {
                'x-xsighub-client-id': this.config.clientId,
            },
        }).then(handleResponse);
    }

    async pair(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}/pair`, {
            method: 'PATCH',
            headers: {
                'x-xsighub-client-id': this.config.clientId,
            },
        }).then(handleResponse);
    }

    async unpair(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}/unpair`, {
            method: 'PATCH',
            headers: {
                'x-xsighub-client-id': this.config.clientId,
            },
        }).then(handleResponse);
    }

    async destroy(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}`, {
            method: 'DELETE',
            headers: {
                'x-xsighub-client-id': this.config.clientId,
            },
        }).then(handleResponse);
    }
}
