const path = require('path');

module.exports = {
    entry: './src/popup.jsx',
    output: {
        filename: 'popup.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}; 