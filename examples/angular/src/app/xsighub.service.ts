import { Injectable } from '@angular/core';
import { SdkClient, client } from '@ekisa-xsighub/sdk';
import { environment } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class XsighubService {
    private _clientId!: string;
    private _sdkClient!: SdkClient;

    get client(): SdkClient {
        return this._sdkClient;
    }

    get clientId(): string {
        return this._clientId;
    }

    set clientId(value: string) {
        this._clientId = value;
        this._sdkClient = client.init({
            api: environment.xsighub.api,
            version: environment.xsighub.version,
            clientId: this._clientId,
        });
    }
}
