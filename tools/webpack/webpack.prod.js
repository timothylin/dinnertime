'use strict'; 

const helpers                         = require('../helpers');
const webpackMerge                    = require('webpack-merge');
const commonConfig                    = require('./webpack.common.js');

// WEBPACK PLUGINS
const DefinePlugin                    = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin               = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin             = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin   = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin                   = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin                  = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin                = require('optimize-js-plugin');
const NgcWebpackPlugin                = require('ngc-webpack').NgcWebpackPlugin;

// METADATA CONSTANTS
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const METADATA = webpackMerge(commonConfig({
  env: ENV
}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: false
});

const extractAppSass = new ExtractTextPlugin('css/app.css');
const extractLightThemeSass = new ExtractTextPlugin('css/theme-light.css');
const extractDarkThemeSass = new ExtractTextPlugin('css/theme-dark.css');

module.exports = function (env) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {
    devtool: 'source-map',
    output: {
      path: helpers.root('dist'),
      filename: '[name].[chunkhash].bundle.js',
      sourceMapFilename: '[name].[chunkhash].bundle.map',
      chunkFilename: '[id].[chunkhash].chunk.js'
    },
    module: {
      rules: [{
          test: /\.scss$/,
          use: extractAppSass.extract(['css-loader', 'sass-loader']),
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
      new OptimizeJsPlugin({
        sourceMap: false
      }),
      extractAppSass,
      extractLightThemeSass,
      extractDarkThemeSass,
      new NgcWebpackPlugin({
        tsConfig: helpers.root('tsconfig.webpack.json'),
        resourceOverride: helpers.root('tools/webpack/resource-override.js')
      }),
      new UglifyJsPlugin({
        beautify: false,
        output: {
          comments: false
        },
        mangle: {
          screw_ie8: true // <3
        },
        compress: {
          screw_ie8: true,
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false,
          drop_console: true,
          drop_debugger: true
        },
      }),
      new NormalModuleReplacementPlugin(
        /angular2-hmr/,
        helpers.root('config/empty.js')
      ),
      new NormalModuleReplacementPlugin(
        /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
        helpers.root('config/empty.js')
      ),
      new LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
          htmlLoader: {
            minimize: true,
            removeAttributeQuotes: false,
            caseSensitive: true,
            customAttrSurround: [
              [/#/, /(?:)/],
              [/\*/, /(?:)/],
              [/\[?\(?/, /(?:)/]
            ],
            customAttrAssign: [/\)?\]?=/]
          },
        }
      })],
    node: {
      global: true,
      crypto: 'empty',
      process: false,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  });
}
