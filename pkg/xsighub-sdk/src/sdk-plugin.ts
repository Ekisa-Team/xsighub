export type BuiltInPlugin = `xsighub:${'environment' | 'longPolling'}`;

export type PluginName = BuiltInPlugin;

export interface SdkPlugin<TResult = unknown, TArgs = any> {
    name: PluginName;
    apply: (args?: TArgs) => TResult;
}
