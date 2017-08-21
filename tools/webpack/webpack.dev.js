'use strict';

const helpers               = require('../helpers');
const webpackMerge          = require('webpack-merge');
const webpackMergeDll       = webpackMerge.strategy({plugins: 'replace'});
const commonConfig          = require('./webpack.common.js');

// WEBPACK PLUGINS
const AddAssetHtmlPlugin    = require('add-asset-html-webpack-plugin');
const DefinePlugin          = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin    = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin   = require('webpack/lib/LoaderOptionsPlugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');

// METADATA CONSTANTS
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR
});

const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;
const extractAppSass = new ExtractTextPlugin('css/app.css');
const extractLightThemeSass = new ExtractTextPlugin('css/theme-light.css');
const extractDarkThemeSass = new ExtractTextPlugin('css/theme-dark.css');

module.exports = function (options) {
  return webpackMerge(commonConfig({env: ENV}), {
    devtool: 'cheap-module-source-map',
    output: {
      path: helpers.root('dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[id].chunk.js',
      library: 'ac_[name]',
      libraryTarget: 'var',
    },
    module: {
      rules: [{
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')],
          exclude: [helpers.root('src', 'styles', 'theme-light'), helpers.root('src', 'styles', 'theme-dark')]
        }, {
          test: /\.scss$/,
          use: extractLightThemeSass.extract(['css-loader', 'sass-loader']),
          include: [helpers.root('src', 'styles', 'theme-light')]
        }, {
          test: /\.scss$/,
          use: extractDarkThemeSass.extract(['css-loader', 'sass-loader']),
          include: [helpers.root('src', 'styles', 'theme-dark')]
        }]
    },
    plugins: [
      extractAppSass,
      extractLightThemeSass,
      extractDarkThemeSass,
      new DefinePlugin({
        // NOTE: when adding additional properties, also include them in custom-typings.d.ts
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
        }
      }),
      new DllBundlesPlugin({
        bundles: {
          polyfills: [
            'core-js',
            {
              name: 'zone.js',
              path: 'zone.js/dist/zone.js'
            }
          ],
          vendor: [
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            '@angular/core',
            '@angular/common',
            '@angular/forms',
            '@angular/http',
            '@angular/router',
            '@angularclass/hmr',
            '@ng-bootstrap/ng-bootstrap',
            'bootstrap',
            'bootstrap-notify',
            'jquery',
            'lodash',
            'moment',
            'rxjs',
            {
              name: 'hopscotch',
              path: 'hopscotch/dist/js/hopscotch.js'
            }
          ]
        },
        dllDir: helpers.root('dll'),
        webpackConfig: webpackMergeDll(commonConfig({env: ENV}), {
          devtool: 'cheap-module-source-map',
          plugins: []
        })
      }),
      new AddAssetHtmlPlugin([
        { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('polyfills')}`) },
        { filepath: helpers.root(`dll/${DllBundlesPlugin.resolveFile('vendor')}`) }
      ]),
      new LoaderOptionsPlugin({
        debug: true
      })],
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  });
}
