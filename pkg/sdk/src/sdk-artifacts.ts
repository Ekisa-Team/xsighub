import { SdkError } from './sdk-error';
import { PluginName, SdkPlugin } from './sdk-plugin';

export type InitConfig = {
    plugins?: SdkPlugin[];
};

export class SdkArtifacts {
    protected _secret!: string;
    protected _api!: string;
    protected _plugins!: SdkPlugin[];

    get secret(): string {
        return this._secret;
    }

    get api(): string {
        return this._api;
    }

    async build(secret: string, config: InitConfig): Promise<SdkArtifacts> {
        this._secret = secret;

        this._plugins = config.plugins || [];

        this._api = await this.usePlugin<string>('xsighub:environment');

        await this.checkSecret();

        return this;
    }

    async checkSecret() {
        if (!this._api) {
            throw new SdkError(
                'Unable to find a valid environment. Make sure to call the init method before continuing.',
            );
        }

        const response = await fetch(`${this._api}/secrets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secret: this._secret }),
        });

        if (response.status === 401) {
            const { message } = (await response.json()) as { message: string };
            throw new SdkError(message);
        }
    }

    validatePlugin(name: PluginName): boolean {
        return this._plugins.some((plugin) => plugin.name === name);
    }

    async usePlugin<TResult, TArgs = unknown>(name: PluginName, args?: TArgs) {
        const plugin = this._plugins.find((plugin) => plugin.name === name) as
            | SdkPlugin<TResult, TArgs>
            | undefined;

        if (!plugin) {
            throw new SdkError(`Unable to find a plugin named ${name}.`);
        }

        const build = (await plugin.apply(args)) as () => Promise<TResult>;

        return (await build()) as TResult;
    }
}
