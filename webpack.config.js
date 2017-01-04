const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ngToolsWebpack = require('@ngtools/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function findExternalIpAddress() {
  const os = require('os');
  const ifaces = os.networkInterfaces();
  for (let name of Object.keys(ifaces)) {
    for (let iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  throw new Error('Could not find the external IP address of this machine');
}

function createWebpackConfig(env={}) {
  //
  // The following environment variables can be used to tweak the build:
  //  * BUILD_MODE: can be 'dev' or 'prod'; defaults to 'dev'
  //  * BUILD_TARGET: can be 'web' or 'cordova'; defaults to 'web'
  //
  const buildMode = env.BUILD_MODE || 'dev';
  const buildTarget = env.BUILD_TARGET || 'web';
  const liveReload = env.LIVE_RELOAD || false;

  // defaults for buildMode === 'dev'
  let tsLoader = ['ts-loader', 'angular2-template-loader'];
  let scssLoader = ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'];
  
  if (buildMode === 'prod') {
    tsLoader = '@ngtools/webpack';
    scssLoader = ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: ['css-loader', 'postcss-loader', 'sass-loader']
    });
  }

  // defaults for buildTarget === 'web'
  let outputDir = 'dist';

  if (buildTarget === 'cordova') {
    outputDir = 'cordova/www';
  }

  let serverAddress = '';
  if (liveReload) {
    serverAddress = findExternalIpAddress() + ':8080';
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
      filename: buildMode === 'prod' ? '[name].[hash].js' : '[name].js'
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
        inject: buildMode === 'prod',
        template: './src/index-' + buildMode + '.ejs',
        buildTarget: buildTarget,
        serverAddress: liveReload ? `http://${serverAddress}/` : ''
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
      host: '0.0.0.0',
      public: liveReload ? serverAddress : '',
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
        filename: buildMode === 'prod' ? '[name].[hash].css' : '[name].css'
      })
    );
  }

  return webpackConfig;
}

module.exports = createWebpackConfig;
