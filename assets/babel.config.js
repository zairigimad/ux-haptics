module.exports = {
    presets: [
        ['@babel/preset-env', {
            loose: true,
            modules: false,
            targets: {
                esmodules: true,
            },
        }],
        ['@babel/preset-typescript', { allowDeclareFields: true }],
    ],
    assumptions: {
        superIsCallableConstructor: false,
    },
};
