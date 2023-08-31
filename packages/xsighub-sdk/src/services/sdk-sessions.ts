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
        }).then(handleResponse);
    }

    async findByIpAddress(): Promise<Session> {
        return fetch(`${this.api}`).then(handleResponse);
    }

    async findByPairingKey(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}`).then(handleResponse);
    }

    async pair(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}/pair`, {
            method: 'PATCH',
        }).then(handleResponse);
    }

    async unpair(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}/unpair`, {
            method: 'PATCH',
        }).then(handleResponse);
    }

    async destroy(pairingKey: string): Promise<Session> {
        return fetch(`${this.api}/${pairingKey}`, {
            method: 'DELETE',
        }).then(handleResponse);
    }
}
