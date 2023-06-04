import {
    SessionDocument,
    SessionDocumentMetadata,
    SessionDocumentSignature,
} from '@ekisa-xsighub/core';
import { handleResponse } from '../helpers';
import { SdkClientConfig } from '../types/sdk-config.type';

type DocumentCreate = Omit<SessionDocument, 'id'>;

export interface SdkDocuments {
    create(data: DocumentCreate): Promise<SessionDocument>;
    findById(documentId: number): Promise<SessionDocument>;
    update(signatureId: number, data: SessionDocument): Promise<SessionDocument>;
    attach(documentId: number, data: SessionDocumentSignature): Promise<SessionDocument>;
    loadMetadata(documentId: number, data: SessionDocumentMetadata): Promise<SessionDocument>;
    delete(signatureId: number): Promise<SessionDocument>;
    extractSignatures(options: { rawContent: string }): Promise<{
        key: string;
        signatureData: string;
    }>;
}

export class Documents implements SdkDocuments {
    api: string;

    constructor(private readonly config: SdkClientConfig) {
        this.api = `${this.config.api}/${this.config.version}/session-documents`;
    }

    async create(data: DocumentCreate): Promise<SessionDocument> {
        return fetch(`${this.api}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async findById(documentId: number): Promise<SessionDocument> {
        return fetch(`${this.api}/${documentId}`).then(handleResponse);
    }

    async update(documentId: number, data: SessionDocument): Promise<SessionDocument> {
        return fetch(`${this.api}/${documentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async attach(documentId: number, data: SessionDocumentSignature): Promise<SessionDocument> {
        return fetch(`${this.api}/${documentId}/signatures/attach`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async loadMetadata(
        documentId: number,
        data: SessionDocumentMetadata,
    ): Promise<SessionDocument> {
        return fetch(`${this.api}/${documentId}/metadata/load`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async delete(documentId: number): Promise<SessionDocument> {
        return fetch(`${this.api}/${documentId}`, {
            method: 'DELETE',
        }).then(handleResponse);
    }

    extractSignatures(options: {
        rawContent: string;
    }): Promise<{ key: string; signatureData: string }> {
        throw new Error('Method not implemented.');
    }
}
