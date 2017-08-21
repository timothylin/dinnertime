const webpack = require('webpack');
const helpers = require('../helpers');

// WEBPACK PLUGINS
const AssetsPlugin                      = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin     = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin          = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin                = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin                 = require('copy-webpack-plugin');
const CheckerPlugin                     = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin                 = require('html-webpack-plugin');
const LoaderOptionsPlugin               = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin        = require('script-ext-html-webpack-plugin');
const ngcWebpack                        = require('ngc-webpack');
const HtmlWebpackExcludeAssetsPlugin    = require('html-webpack-exclude-assets-plugin');
const IgnorePlugin                      = require('webpack/lib/IgnorePlugin');

const METADATA = {
  isDevServer: helpers.isWebpackDevServer()
};

// WEBPACK CONFIGURATION
module.exports = function (options) {
  isProd = options.env === 'production';
  return {
    entry: {
      'polyfills': './src/polyfills.browser.ts',
      'main': isProd ? './src/main.browser.aot.ts' : './src/main.browser.ts'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      modules: [helpers.root('src'), helpers.root('node_modules')],
    },
    module: {
      rules: [{
        test: /\.ts$/,
        use: [{
          loader: '@angularclass/hmr-loader',
          options: {
            pretty: !isProd,
            prod: isProd
          }
        }, {
          loader: 'ng-router-loader',
          options: {
            loader: 'async-import',
            genDir: 'compiled',
            aot: isProd
          }
        }, {
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: helpers.root('tsconfig.webpack.json'),
            useCache: !isProd
          }
        }, {
          loader: 'angular2-template-loader'
        }],
        exclude: [/\.(spec|e2e)\.ts$/]
      }, {
        test: /\.json$/,
        use: 'json-loader'
      }, {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [helpers.root('src', 'styles')]
      }, {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [helpers.root('src', 'styles')]
      }, {
        test: /\.html$/,
        use: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
      }, {
        test: /\.(jpg|svg|png|gif)$/,
        use: 'file-loader'
      }],
    },
    plugins: [
      new IgnorePlugin(/^\.\/locale$/, /moment$/),
      new AssetsPlugin({
        path: helpers.root('dist'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),
      new CheckerPlugin(),
      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),
      new CommonsChunkPlugin({
        name: 'vendor',
        chunks: ['main'],
        minChunks: module => /node_modules/.test(module.resource)
      }),
      new CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),
      new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('src'),
        {
          // Angular async route paths relative to this root directory
        }
      ),
      new CopyWebpackPlugin([
        { from: 'src/assets', to: 'assets' },
        { from: 'src/meta' }
      ]),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        chunksSortMode: 'dependency',
        inject: 'head',
        metadata: METADATA,
        excludeAssets: [/theme-.*.css/, /.module.bundle.js/]
      }),
      new HtmlWebpackExcludeAssetsPlugin(),
      new ScriptExtHtmlWebpackPlugin({
        defaultAttribute: 'defer'
      }),
      new LoaderOptionsPlugin({}),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)async/,
        helpers.root('node_modules/@angular/core/src/facade/async.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)collection/,
        helpers.root('node_modules/@angular/core/src/facade/collection.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)errors/,
        helpers.root('node_modules/@angular/core/src/facade/errors.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)lang/,
        helpers.root('node_modules/@angular/core/src/facade/lang.js')
      ),
      new NormalModuleReplacementPlugin(
        /facade(\\|\/)math/,
        helpers.root('node_modules/@angular/core/src/facade/math.js')
      )],
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };
}
