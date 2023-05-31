import {
    Qr,
    References,
    SdkQr,
    SdkReferences,
    SdkSessions,
    SdkSignatures,
    Sessions,
    Signatures,
} from './services';
import { SdkClientConfig } from './types';

export interface SdkClient {
    init: (config: SdkClientConfig) => SdkClient;
    sessions: SdkSessions;
    references: SdkReferences;
    signatures: SdkSignatures;
    qr: SdkQr;
}

const createSdkClient = (): SdkClient => {
    let sdkSessions: SdkSessions;
    let sdkReferences: SdkReferences;
    let sdkSignatures: SdkSignatures;
    let sdkQr: SdkQr;

    let initialized = false;

    const assertInitialization = () => {
        if (!initialized) {
            throw new Error(
                'SdkClient is not initialized. Make sure to call the init(config) method first.',
            );
        }
    };

    return {
        init(config: SdkClientConfig) {
            sdkSessions = new Sessions(config);
            sdkReferences = new References(config);
            sdkSignatures = new Signatures(config);
            sdkQr = new Qr();

            initialized = true;

            return this;
        },
        get sessions(): SdkSessions {
            assertInitialization();
            return sdkSessions;
        },
        get references(): SdkReferences {
            assertInitialization();
            return sdkReferences;
        },
        get signatures(): SdkSignatures {
            assertInitialization();
            return sdkSignatures;
        },
        get qr(): SdkQr {
            assertInitialization();
            return sdkQr;
        },
    };
};

export const client: SdkClient = createSdkClient();
