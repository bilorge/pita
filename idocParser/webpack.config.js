const path = require('path');

module.exports = {
    mode: 'developement',
    entry: './app/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-laoder',
                exclude: /node_modules/
            }
        ]
    },
    resolve: ['.ts','.js']
};
