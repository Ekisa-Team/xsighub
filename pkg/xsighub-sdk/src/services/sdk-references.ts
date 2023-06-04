import { SessionReference } from '@ekisa-xsighub/core';
import { handleResponse } from '../helpers';
import { SdkClientConfig } from '../types/sdk-config.type';

type ReferenceCreate = Omit<SessionReference, 'id' | 'signatures'>;

type ReferenceUpdate = Partial<ReferenceCreate>;

export interface SdkReferences {
    create(data: ReferenceCreate): Promise<SessionReference>;
    update(referenceId: number, data: ReferenceUpdate): Promise<SessionReference>;
    delete(referenceId: number): Promise<SessionReference>;
}

export class References implements SdkReferences {
    api: string;

    constructor(private readonly config: SdkClientConfig) {
        this.api = `${this.config.api}/${this.config.version}/session-references`;
    }

    async create(data: ReferenceCreate): Promise<SessionReference> {
        return fetch(`${this.api}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async update(referenceId: number, data: ReferenceUpdate): Promise<SessionReference> {
        return fetch(`${this.api}/${referenceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(handleResponse);
    }

    async delete(referenceId: number): Promise<SessionReference> {
        return fetch(`${this.api}/${referenceId}`, {
            method: 'DELETE',
        }).then(handleResponse);
    }
}
