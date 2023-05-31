import { SessionSignature } from '@ekisa-xsighub/core';
import { handleResponse } from '../helpers';
import { SdkClientConfig } from '../types/sdk-config.type';

type SignatureCreate = Omit<SessionSignature, 'id'>;

export interface SdkSignatures {
    create(data: SignatureCreate): Promise<SessionSignature>;
    update(signatureId: number, data: SessionSignature): Promise<SessionSignature>;
    delete(signatureId: number): Promise<SessionSignature>;
}

export class Signatures implements SdkSignatures {
    api: string;

    constructor(private readonly config: SdkClientConfig) {
        this.api = `${this.config.host}/api/${this.config.version}/session-signatures`;
    }

    async create(data: SignatureCreate): Promise<SessionSignature> {
        return fetch(`${this.api}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async update(signatureId: number, data: SessionSignature): Promise<SessionSignature> {
        return fetch(`${this.api}/${signatureId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async delete(signatureId: number): Promise<SessionSignature> {
        return fetch(`${this.api}/${signatureId}`, {
            method: 'DELETE',
        }).then(handleResponse);
    }
}
