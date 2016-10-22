var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ngToolsWebpack = require('@ngtools/webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var appEnvironment = process.env.APP_ENVIRONMENT || 'development';
var isProduction = appEnvironment === 'production'; 

var tsLoader = ['ts', 'angular2-template'];
var scssLoader = ['style', 'css', 'postcss', 'sass'];
if (isProduction) {
  tsLoader = '@ngtools/webpack';
  scssLoader = ExtractTextPlugin.extract({ fallbackLoader: 'style', loader: ['css', 'postcss', 'sass'] });
}

var webpackConfig = {

  entry: {
    'app': './src/main.ts',
    'polyfills': [
      'core-js/es6',
      'core-js/es7/reflect',
      'zone.js/dist/zone'
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: tsLoader },
      { test: /\.html$/, loader: 'raw' },
      { test: /\.css$/, loader: 'raw' },
      { test: /\.scss$/, loader: scssLoader },
      { test: /\.(eot|svg|ttf|woff|woff2)(\?v=.*)?$/, loader: 'file?name=fonts/[name].[ext]' }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.html', '.css']
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
      app: {
        environment: JSON.stringify(appEnvironment)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        resolve: {
          // see https://github.com/TypeStrong/ts-loader/issues/283#issuecomment-249414784
        },
        postcss: [
          autoprefixer({
            browsers: [
              'last 2 versions',
              'iOS >= 8',
              'Android >= 4.4'
              // 'Explorer >= 11',
              // 'ExplorerMobile >= 11'
            ],
            cascade: false
          })
        ]
      }
    })
  ]
  // devServer: {
  //   stats: 'errors-only'
  // }

};

if (isProduction) {
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
