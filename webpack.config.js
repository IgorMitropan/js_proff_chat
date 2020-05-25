'use strict';
let path = require('path');
let webpack = require('webpack');

module.exports = {
    entry: ['./frontend/js/main.js'],
    output: {
        path: './public/js/',
        publicPath: './public/',
        filename: "chat.js"
    },

    watch: true,
    devtool: "source-map",

    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,

            loader: 'babel',
            query: {
                presets: ['es2015'],
                plugins: ['transform-es2015-modules-commonjs', 'transform-runtime']
            }
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]

};
