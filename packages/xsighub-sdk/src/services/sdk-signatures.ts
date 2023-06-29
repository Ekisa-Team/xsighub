import { SessionSignature, SessionSignatureMetadata } from '@ekisa-xsighub/core';
import { handleResponse } from '../helpers';
import { SdkClientConfig } from '../types/sdk-config.type';

type SignatureCreate = Omit<SessionSignature, 'id'>;

export interface SdkSignatures {
    create(data: SignatureCreate): Promise<SessionSignature>;
    findById(signatureId: number): Promise<SessionSignature>;
    update(signatureId: number, data: SessionSignature): Promise<SessionSignature>;
    loadMetadata(documentId: number, data: SessionSignatureMetadata): Promise<SessionSignature>;
    delete(signatureId: number): Promise<SessionSignature>;
}

export class Signatures implements SdkSignatures {
    api: string;

    constructor(private readonly config: SdkClientConfig) {
        this.api = `${this.config.api}/${this.config.version}/session-signatures`;
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

    async findById(signatureId: number): Promise<SessionSignature> {
        return fetch(`${this.api}/${signatureId}`).then(handleResponse);
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

    async loadMetadata(
        documentId: number,
        data: SessionSignatureMetadata,
    ): Promise<SessionSignature> {
        return fetch(`${this.api}/${documentId}/metadata/load`, {
            method: 'PATCH',
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
