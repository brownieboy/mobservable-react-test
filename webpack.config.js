var path = require('path');

var ROOT_PATH = path.resolve(__dirname);

module.exports = {
    entry: {
        app: path.resolve(ROOT_PATH, 'src/todo.jsx')
    },
    output: {
        path: path.resolve(ROOT_PATH, 'build'),
        filename: 'js/bundle.js'
    },
    devtool: 'source-map',
    module: {
        // Note: don't include the same loader in multiple places, e.g putting babel under "common" and here.
        // Webpack will error out if you try this.
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel'],
            include: path.resolve(ROOT_PATH, 'src')
        }]
    }
}
