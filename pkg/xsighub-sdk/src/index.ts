import { InitConfig, SdkArtifacts } from './sdk-artifacts';
import { SdkSessions, Sessions } from './sessions';

export interface SdkClient {
    init: (secret: string, args: InitConfig) => Promise<SdkClient>;
    sessions: SdkSessions;
}

const createSdkClient = (): SdkClient => {
    let sdkSessions: SdkSessions;
    let initialized = false;

    const assertInitialized = () => {
        if (!initialized) {
            throw new Error('SdkClient is not initialized. Call the init method first.');
        }
    };

    return {
        async init(secret: string, args: InitConfig) {
            const artifacts = await new SdkArtifacts().build(secret, args);

            sdkSessions = new Sessions(artifacts);

            initialized = true;

            return this;
        },
        get sessions(): SdkSessions {
            assertInitialized();
            return sdkSessions;
        },
    };
};

export const client: SdkClient = createSdkClient();

export * from './plugins';
