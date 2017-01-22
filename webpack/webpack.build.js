var loaders = require('./loaders');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
        filename: './[name].bundle.js',
        path: 'dist',
        publicPath: '/'
    },
    resolve: {
        root: __dirname,
        extensions: ['', '.ts', '.js', '.json']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.jquery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
    ],
    module: {
        loaders: loaders
    }
};