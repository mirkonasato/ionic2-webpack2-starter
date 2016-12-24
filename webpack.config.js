const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ngToolsWebpack = require('@ngtools/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//
// The following environment variables can be used to tweak the build:
//  * BUILD_MODE: can be 'dev' or 'prod'; defaults to 'dev'
//  * BUILD_TARGET: can be 'web' or 'cordova'; defaults to 'web'
//
const buildMode = process.env.BUILD_MODE || 'dev';
const buildTarget = process.env.BUILD_TARGET || 'web';

let tsLoader = ['ts-loader', 'angular2-template-loader'];
let scssLoader = ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'];
if (buildMode === 'prod') {
  tsLoader = '@ngtools/webpack';
  scssLoader = ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: ['css-loader', 'postcss-loader', 'sass-loader']
  });
}

let outputDir = 'dist';
if (buildTarget === 'cordova') {
  outputDir = 'cordova/www';
}

const webpackConfig = {

  entry: {
    'app': './src/main.ts',
    'polyfills': [
      'core-js/es6',
      'core-js/es7/reflect',
      'zone.js/dist/zone'
    ]
  },
  output: {
    path: path.resolve(outputDir),
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: tsLoader },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.scss$/, exclude: path.resolve('src/app'), loader: scssLoader },
      { test: /\.scss$/, include: path.resolve('src/app'), loader: ['raw-loader', 'postcss-loader', 'sass-loader'] },
      { test: /\.(eot|svg|ttf|woff|woff2)(\?v=.*)?$/, loader: 'file-loader?name=fonts/[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.html', '.scss']
  },
  plugins: [
    // see https://github.com/angular/angular/issues/11580
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      './src'
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.DefinePlugin({
      build: {
        mode: JSON.stringify(buildMode),
        target: JSON.stringify(buildTarget)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        resolve: {
          // see https://github.com/TypeStrong/ts-loader/issues/283#issuecomment-249414784
        },
        postcss: [
          autoprefixer({
            // taken from https://github.com/driftyco/ionic-app-scripts/blob/master/config/sass.config.js
            browsers: [
              'last 2 versions',
              'iOS >= 8',
              'Android >= 4.4',
              'Explorer >= 11',
              'ExplorerMobile >= 11'
            ],
            cascade: false
          })
        ]
      }
    })
  ],
  devServer: {
    stats: 'errors-only'
  }

};

if (buildMode === 'prod') {
  webpackConfig.plugins.push(
    new ngToolsWebpack.AotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: './src/app/app.module#AppModule'
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css'
    })
  );
}

module.exports = webpackConfig;
