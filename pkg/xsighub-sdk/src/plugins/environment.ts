import { SdkPlugin } from '../sdk-plugin';

interface EnvironmentPluginArgs {
    having: Record<string, string>;
    use: string;
}

export function environmentPlugin(args: EnvironmentPluginArgs): SdkPlugin {
    return {
        name: 'xsighub:environment',
        apply: () => {
            return async () => args.having[args.use];
        },
    };
}
