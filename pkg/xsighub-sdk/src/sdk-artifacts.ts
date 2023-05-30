import { SdkError } from './sdk-error';
import { PluginName, SdkPlugin } from './sdk-plugin';

export type InitConfig = {
    plugins?: SdkPlugin[];
};

export class SdkArtifacts {
    protected _api!: string;
    protected _plugins!: SdkPlugin[];

    get api(): string {
        return this._api;
    }

    async build(config: InitConfig): Promise<SdkArtifacts> {
        this._plugins = config.plugins || [];

        this._api = await this.usePlugin<string>('xsighub:environment');

        return this;
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
