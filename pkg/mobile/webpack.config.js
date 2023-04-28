// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('@nativescript/webpack');

module.exports = (env) => {
    webpack.init(env);

    // Learn how to customize:
    // https://docs.nativescript.org/webpack

    return webpack.resolveConfig();
};
