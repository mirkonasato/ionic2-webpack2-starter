var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var appEntry = './src/main-dev.ts';
if (process.env.TARGET === 'prod') {
  appEntry = './src/main-prod.ts';
}

module.exports = {

  entry: {
    'app': appEntry,
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
      {test: /\.component.ts$/, loader: 'ts!angular2-template'},
      {test: /\.page.ts$/, loader: 'ts!angular2-template'},
      {test: /\.ts$/, exclude: /\.(component|page).ts$/, loader: 'ts'},
      {test: /\.html$/, loader: 'raw'},
      {test: /\.css$/, loader: 'raw'}
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
    new CopyWebpackPlugin([
      { from: 'node_modules/ionic-angular/css', to: 'css' },
      { from: 'node_modules/ionic-angular/fonts', to: 'fonts' }
    ])
  ],
  devServer: {
    stats: 'errors-only'
  }

};
