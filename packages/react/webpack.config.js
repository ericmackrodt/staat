'use strict';
/*global __dirname, require, module*/
//https://github.com/krasimir/webpack-library-starter/blob/master/webpack.config.js
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = '@staat/react';

let plugins = [];
const outputFile = 'index.js';

const config = {
  entry: __dirname + '/src/index.tsx',
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [{
      test: /(\.tsx?)$/,
      loader: 'ts-loader',
      exclude: /(node_modules|bower_components)/
    }]
  },
  resolve: {
    modules: ['node_modules', path.resolve('./src')],
    extensions: ['.json', '.ts', '.tsx', '.js'],
    symlinks: false,
  },
  plugins: plugins
};

if (env === 'build') {
  config.optimization = {
    minimize: true
  };
};

module.exports = config;
