var loaders = require('./loaders');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.ts',
        vendor: [
            '@ngrx/store',
            '@angular/common',
            '@angular/compiler',
            '@angular/core',
            '@angular/http',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            'bootstrap',
            'jquery',
            'lodash',
            'rxjs',
            'toastr',
            '@angular/router-deprecated',
            'bootstrap/dist/css/bootstrap.css',
            'toastr/build/toastr.css',
            'font-awesome/css/font-awesome.css'
        ]
    },
    output: {
        filename: './dev/[name].bundle.js',
        path: 'dev',
        publicPath: '/'
    },
    devServer: {
        contentBase: 'dev',
        hot: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules']
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new OpenBrowserPlugin({url: 'http://localhost:8080'}),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'dev/vendor.bundle.js')
    ],
    module: {
        loaders: loaders
    }
};